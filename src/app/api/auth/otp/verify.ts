import { NextRequest, NextResponse } from 'next/server';
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import Otp from "@/models/Otp";

export async function POST(request: NextRequest) {
  try {
    // Connect to the MongoDB database
    await dbConnect();

    // Extract email, phone number, and OTP from the request body
    const { email, phone_number, otp } = await request.json();

    // Validate input: Ensure either email or phone number, and OTP are provided
    if ((!email && !phone_number) || !otp) {
      return NextResponse.json(
        { message: "Email or phone number and OTP are required" },
        { status: 400 }
      );
    }

    // Find OTP record by email or phone number
    const otpRecord = email
      ? await Otp.findOne({ email }) // Find by email if email is provided
      : await Otp.findOne({ phone_number }); // Find by phone number if phone number is provided

    // Check if OTP record exists
    if (!otpRecord) {
      return NextResponse.json(
        { message: "OTP not found or expired" },
        { status: 400 }
      );
    }

    // Compare provided OTP with the hashed OTP in the database
    const isMatch = bcrypt.compareSync(otp, otpRecord.otp);

    // If OTP does not match, return an error
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // Delete the OTP record after successful verification
    if (email) {
      await Otp.deleteOne({ email });
    } else if (phone_number) {
      await Otp.deleteOne({ phone_number });
    }

    // Respond with a success message
    return NextResponse.json(
      { message: "OTP verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in OTP verification route:', error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}