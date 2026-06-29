import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/lib/models/Student";
import User from "@/lib/models/User";
import { hashPassword } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const department = searchParams.get("department") || "";
    const level = searchParams.get("level") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const query: any = {};
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (department) query.department = department;
    if (level) query.level = level;

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      students,
      total,
      totalPages: Math.ceil(total / limit),
      page,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();
    const data: any = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    const student = await Student.create(data);

    const existingUser = await User.findOne({ email: data.email });
    if (!existingUser) {
      const defaultPassword = data.studentId || "password123";
      const hashed = await hashPassword(defaultPassword);
      await User.create({
        name: data.fullName,
        studentId: data.studentId,
        email: data.email,
        phone: data.phone,
        password: hashed,
        role: "student",
        department: data.department,
        faculty: data.faculty,
        level: data.level,
      });
    }

    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create student" }, { status: 500 });
  }
}
