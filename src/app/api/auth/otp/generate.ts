import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import Otp from "@/models/Otp";
import twilio from "twilio";

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Send email
const createEtherealAccount = async () => {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

const sendEmail = async (email: string, otp: string) => {
  const transporter = await createEtherealAccount();
  const mailOptions = {
    from: "qS3p3@example.com", // sender address
    to: email,
    subject: "Your OTP",
    text: `Your OTP is ${otp}`,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

// send SMS
const sendSms = async (phoneNumber: string, otp: string) => {
  // Create a Twilio client
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  // Send the OTP via SMS
  await client.messages.create({
    body: `Your OTP code is ${otp}`, // Message body
    from: process.env.TWILIO_PHONE_NUMBER, // Sender phone number
    to: phoneNumber, // Recipient phone number
  });
};

export default async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await dbConnect();

    const { email, phone_number, deliveryMethod } = await request.json();

    // Validate input
    if (!email && !phone_number) {
      return NextResponse.json(
        { message: "Email or phone number is required" },
        { status: 400 }
      );
    }

    if (!deliveryMethod || !["email", "sms"].includes(deliveryMethod)) {
      return NextResponse.json(
        { message: "Valid delivery method is required" },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOtp();
    const hashedOtp = bcrypt.hashSync(otp, 10);

    const newOtp = new Otp({
      email: deliveryMethod === "email" ? email : undefined,
      phone_number: deliveryMethod === "sms" ? phone_number : undefined,
      otp: hashedOtp,
    });

    await newOtp.save();

    // Send the OTP via the selected delivery method
    if (deliveryMethod === "email" && email) {
      await sendEmail(email, otp);
    } else if (deliveryMethod === "sms" && phone_number) {
      await sendSms(phone_number, otp);
    } else {
      return NextResponse.json(
        { message: "Invalid delivery method or missing contact information" },
        { status: 400 }
      );
    }

    // Respond with a success message
    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in OTP route:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
