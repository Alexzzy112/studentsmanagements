import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { comparePassword, generateToken } from "@/lib/auth";

const ALLOWED_ROLES: Record<string, string[]> = {
  student: ["student"],
  staff: ["staff", "hod"],
  admin: ["admin"],
};

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password, role } = await req.json();

    const user = await User.findOne({
      $or: [{ email }, { studentId: email }],
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      const isEmailLogin = !/^STU-/i.test(email);
      if (isEmailLogin && user.role === "student" && user.studentId) {
        return NextResponse.json({ error: `Invalid password. Your Student ID is: ${user.studentId}`, studentId: user.studentId }, { status: 401 });
      }
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const allowed = ALLOWED_ROLES[role];
    if (allowed && !allowed.includes(user.role)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = generateToken({ id: user._id.toString(), email: user.email, role: user.role });

    return NextResponse.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
