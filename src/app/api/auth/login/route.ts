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
