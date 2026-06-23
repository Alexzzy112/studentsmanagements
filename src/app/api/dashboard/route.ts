import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/lib/models/Student";
import Department from "@/lib/models/Department";
import Faculty from "@/lib/models/Faculty";

export async function GET() {
  try {
    await connectDB();

    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ status: "active" });
    const graduatedStudents = await Student.countDocuments({ status: "graduated" });
    const departments = await Department.countDocuments();
    const faculties = await Faculty.countDocuments();

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newRegistrations = await Student.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    return NextResponse.json({
      totalStudents,
      activeStudents,
      departments,
      faculties,
      newRegistrations,
      graduatedStudents,
    });
  } catch (error) {
    return NextResponse.json({
      totalStudents: 0,
      activeStudents: 0,
      departments: 0,
      faculties: 0,
      newRegistrations: 0,
      graduatedStudents: 0,
    });
  }
}
