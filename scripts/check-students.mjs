import mongoose from "mongoose";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const envPath = resolve(__dirname, "..", ".env.local");
  if (!existsSync(envPath)) {
    console.error(".env.local not found");
    process.exit(1);
  }
  const content = readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    process.env[key] = val;
  }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set");
  process.exit(1);
}

const UserSchema = new mongoose.Schema({ name: String, email: String, role: String, studentId: String });
const User = mongoose.models.User || mongoose.model("User", UserSchema);

const StudentSchema = new mongoose.Schema({ studentId: String, fullName: String, email: String });
const Student = mongoose.models.Student || mongoose.model("Student", StudentSchema);

async function check() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected");

  const allUsers = await User.find({}, { name: 1, email: 1, role: 1 });
  console.log(`\nUsers (${allUsers.length}):`);
  allUsers.forEach(u => console.log(`  ${u.role}: ${u.name} <${u.email}>`));

  const studentUsers = await User.find({ role: "student" });
  console.log(`\nStudent accounts: ${studentUsers.length}`);

  const allStudents = await Student.find({}, { fullName: 1, email: 1 });
  console.log(`\nStudent records (${allStudents.length}):`);
  allStudents.forEach(s => console.log(`  ${s.fullName} <${s.email}>`));

  await mongoose.disconnect();
}

check().catch(err => { console.error(err); process.exit(1); });
