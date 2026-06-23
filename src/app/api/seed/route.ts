import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { hashPassword } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (key !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const users = [
      {
        name: "Admin User",
        email: "admin@school.edu",
        password: "password123",
        role: "admin" as const,
        department: "Administration",
        faculty: "Administration",
      },
      {
        name: "Head of Department",
        email: "hod@school.edu",
        password: "password123",
        role: "hod" as const,
        department: "Science",
        faculty: "Science",
      },
    ];

    const results: string[] = [];

    for (const u of users) {
      const existing = await User.findOne({ email: u.email });
      if (existing) {
        results.push(`Already exists: ${u.email} (${u.role})`);
        continue;
      }
      const hashed = await hashPassword(u.password);
      await User.create({ ...u, password: hashed });
      results.push(`Created: ${u.email} (${u.role})`);
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
