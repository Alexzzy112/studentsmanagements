import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Department from "@/lib/models/Department";

export async function GET() {
  try {
    await connectDB();
    const departments = await Department.find().sort({ name: 1 });
    return NextResponse.json({ departments });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const department = await Department.create(body);
    return NextResponse.json(department, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create department" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const { _id, ...data } = await req.json();
    const department = await Department.findByIdAndUpdate(_id, data, { new: true });
    return NextResponse.json(department);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update department" }, { status: 500 });
  }
}
