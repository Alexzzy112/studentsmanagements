import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Setting from "@/lib/models/Setting";

export async function GET() {
  try {
    await connectDB();
    const settings = await Setting.find();
    const map: any = {};
    settings.forEach((s: any) => { map[s.key] = s.value; });
    return NextResponse.json({ settings: map });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { key, value } = await req.json();
    await Setting.findOneAndUpdate({ key }, { key, value }, { upsert: true });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
