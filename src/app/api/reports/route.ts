import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/lib/models/Student";
import Result from "@/lib/models/Result";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "enrollment";

    if (type === "enrollment") {
      const total = await Student.countDocuments();
      const active = await Student.countDocuments({ status: "active" });
      const graduated = await Student.countDocuments({ status: "graduated" });
      const byLevel = await Student.aggregate([
        { $group: { _id: "$level", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]);
      return NextResponse.json({ total, active, graduated, byLevel });
    }

    if (type === "department") {
      const byDepartment = await Student.aggregate([
        { $group: { _id: "$department", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);
      return NextResponse.json({ byDepartment });
    }

    if (type === "performance") {
      const results = await Result.aggregate([
        { $group: { _id: "$department", avgScore: { $avg: "$score" }, count: { $sum: 1 } } },
        { $sort: { avgScore: -1 } },
      ]);
      return NextResponse.json({ results });
    }

    return NextResponse.json({ message: "Report type not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
