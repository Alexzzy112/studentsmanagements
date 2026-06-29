import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/lib/models/Student";
import User from "@/lib/models/User";

export async function DELETE() {
  try {
    await connectDB();

    const studentResult = await Student.deleteMany({});
    const userResult = await User.deleteMany({ role: "student" });

    return NextResponse.json({
      success: true,
      deletedStudents: studentResult.deletedCount,
      deletedAccounts: userResult.deletedCount,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete students" }, { status: 500 });
  }
}
