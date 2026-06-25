import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/lib/models/Student";
import User from "@/lib/models/User";
import Result from "@/lib/models/Result";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const user = await User.findOne({ email }).select("-password");
    const student = await Student.findOne({ email });

    const results = await Result.find({ studentId: student?.studentId || user?.studentId }).sort({ createdAt: -1 });

    const courses = results.map((r) => ({
      code: r.courseCode,
      name: r.courseTitle,
      credits: r.credits,
      score: r.score,
      grade: r.grade,
      semester: r.semester,
      academicYear: r.academicYear,
    }));

    const completedCourses = results.filter((r) => r.grade && r.grade !== "F").length;
    const totalCredits = results.reduce((sum, r) => sum + (r.credits || 0), 0);

    let totalGradePoints = 0;
    let totalCreditHours = 0;
    for (const r of results) {
      if (r.gradePoint && r.grade !== "F") {
        totalGradePoints += r.gradePoint * r.credits;
        totalCreditHours += r.credits;
      }
    }
    const gpa = totalCreditHours > 0 ? (totalGradePoints / totalCreditHours).toFixed(2) : "—";

    const latest = results[0];
    const currentSemester = latest?.semester || "—";
    const currentSession = latest?.academicYear || student?.admissionYear || "";

    return NextResponse.json({
      name: student?.fullName || user?.name || "",
      email: student?.email || user?.email || "",
      studentId: student?.studentId || user?.studentId || "",
      photo: student?.photo || "",
      department: student?.department || user?.department || "",
      faculty: student?.faculty || user?.faculty || "",
      level: student?.level || user?.level || "",
      status: student?.status || "active",
      gender: student?.gender || "",
      phone: student?.phone || "",
      address: student?.address || "",
      admissionYear: student?.admissionYear || "",
      semester: currentSemester,
      session: currentSession,
      courses,
      completedCourses,
      totalCredits,
      gpa,
    });
  } catch {
    return NextResponse.json({
      name: "", email: "", studentId: "", photo: "",
      department: "", faculty: "", level: "", status: "active",
      gender: "", phone: "", address: "", admissionYear: "",
      semester: "", session: "",
      courses: [], completedCourses: 0, totalCredits: 0, gpa: "—",
    });
  }
}
