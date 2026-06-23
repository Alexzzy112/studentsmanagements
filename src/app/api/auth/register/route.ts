import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Student from "@/lib/models/Student";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { fullName, studentId, department, faculty, level, email, phone, password } = await req.json();

    const existing = await User.findOne({ $or: [{ email }, { studentId }] });
    if (existing) {
      return NextResponse.json({ error: "Email or Student ID already exists" }, { status: 400 });
    }

    const hashed = await hashPassword(password);

    const user = await User.create({
      name: fullName,
      studentId,
      email,
      phone,
      password: hashed,
      role: "student",
      department,
      faculty,
      level,
    });

    await Student.create({
      studentId,
      fullName,
      email,
      phone,
      department,
      faculty,
      level,
      status: "active",
    });

    return NextResponse.json({ success: true, userId: user._id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 });
  }
}
