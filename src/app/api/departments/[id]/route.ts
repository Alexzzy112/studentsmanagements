import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Department from "@/lib/models/Department";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await req.json();
    const dept = await Department.findByIdAndUpdate(id, data, { new: true });
    if (!dept) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(dept);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const dept = await Department.findByIdAndDelete(id);
    if (!dept) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
