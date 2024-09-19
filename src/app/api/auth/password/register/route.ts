import { NextResponse } from 'next/server';
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ message: "User already exists" }, { status: 400 });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();

  return NextResponse.json({ message: "Signup successful!" }, { status: 201 });
}