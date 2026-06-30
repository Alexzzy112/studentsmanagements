import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/lib/models/Course";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department");
    const level = searchParams.get("level");
    const semester = searchParams.get("semester");

    const query: any = {};
    if (department) query.department = department;
    if (level) query.level = level;
    if (semester) query.semester = semester;

    const courses = await Course.find(query).sort({ code: 1 });
    return NextResponse.json({ courses });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const course = await Course.create(body);
    return NextResponse.json(course, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
