import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CourseRegistration from "@/lib/models/CourseRegistration";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { studentId, courseCode, semester, academicYear, level } = await req.json();

    const existing = await CourseRegistration.findOne({ studentId, courseCode, semester, academicYear });
    if (existing) {
      return NextResponse.json({ error: "Already registered for this course" }, { status: 400 });
    }

    const registration = await CourseRegistration.create({ studentId, courseCode, semester, academicYear, level });
    return NextResponse.json(registration, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await CourseRegistration.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to unregister" }, { status: 500 });
  }
}
