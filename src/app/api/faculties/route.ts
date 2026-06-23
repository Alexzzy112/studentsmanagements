import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Faculty from "@/lib/models/Faculty";

export async function GET() {
  try {
    await connectDB();
    const faculties = await Faculty.find().sort({ name: 1 });
    return NextResponse.json({ faculties });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch faculties" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const faculty = await Faculty.create(body);
    return NextResponse.json(faculty, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
