import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CourseRegistration from "@/lib/models/CourseRegistration";
import Course from "@/lib/models/Course";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const semester = searchParams.get("semester");
    const academicYear = searchParams.get("academicYear");

    const query: any = {};
    if (studentId) query.studentId = studentId;
    if (semester) query.semester = semester;
    if (academicYear) query.academicYear = academicYear;

    const registrations = await CourseRegistration.find(query).sort({ createdAt: -1 });

    const courseCodes = registrations.map((r) => r.courseCode);
    const courses = await Course.find({ code: { $in: courseCodes } });

    const courseMap = new Map(courses.map((c) => [c.code, c]));

    const data = registrations.map((r) => ({
      _id: r._id,
      studentId: r.studentId,
      courseCode: r.courseCode,
      semester: r.semester,
      academicYear: r.academicYear,
      level: r.level,
      registeredAt: r.registeredAt,
      course: courseMap.get(r.courseCode) || null,
    }));

    return NextResponse.json({ registrations: data });
  } catch {
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 });
  }
}
