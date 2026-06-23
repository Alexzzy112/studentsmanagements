import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Student from "@/lib/models/Student";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { fullName, department, faculty, level, email, phone, password, photo, dateOfBirth, address } = await req.json();
    const dept = department as string;

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const deptCode = dept === "Computer Science" ? "CS" : dept.slice(0, 2).toUpperCase();
    const lastStudent = await Student.findOne({ studentId: new RegExp(`^STU-${deptCode}`) })
      .sort({ studentId: -1 })
      .select("studentId");
    let nextNum = 1;
    if (lastStudent) {
      const parts = lastStudent.studentId.split(deptCode);
      if (parts.length > 1) nextNum = parseInt(parts[1]) + 1;
    }
    const studentId = `STU-${deptCode}${String(nextNum).padStart(3, "0")}`;

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
      photo,
      dateOfBirth,
      address,
    });

    await Student.create({
      studentId,
      fullName,
      email,
      phone,
      department,
      faculty,
      level,
      photo,
      dateOfBirth,
      address,
      status: "active",
    });

    return NextResponse.json({ success: true, studentId, userId: user._id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 });
  }
}
