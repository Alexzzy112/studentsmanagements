import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Student from "@/lib/models/Student";
import { hashPassword } from "@/lib/auth";

const DEPARTMENTS: { name: string; faculty: string }[] = [
  { name: "Computer Science", faculty: "Science" },
  { name: "Mathematics", faculty: "Science" },
  { name: "Physics", faculty: "Science" },
  { name: "Chemistry", faculty: "Science" },
  { name: "Biology", faculty: "Science" },
  { name: "Engineering", faculty: "Engineering" },
];

const FIRST_NAMES = [
  "John", "Jane", "Michael", "Sarah", "David", "Emily", "James", "Jessica",
  "Robert", "Amanda", "William", "Olivia", "Daniel", "Sophia", "Christopher",
  "Isabella", "Matthew", "Mia", "Andrew", "Charlotte",
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin",
];

const LEVELS = ["100", "200", "300", "400", "500"];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePhone(): string {
  const prefixes = ["080", "081", "090", "070", "091"];
  const digits = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join("");
  return `${randomItem(prefixes)}${digits}`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  const seedStudents = searchParams.get("students") === "true";

  if (key !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const results: string[] = [];

    if (!seedStudents) {
      const users = [
        {
          name: "Admin User",
          email: "admin@school.edu",
          password: "password123",
          role: "admin" as const,
          department: "Administration",
          faculty: "Administration",
        },
        {
          name: "Head of Department",
          email: "hod@school.edu",
          password: "password123",
          role: "hod" as const,
          department: "Science",
          faculty: "Science",
        },
      ];

      for (const u of users) {
        const existing = await User.findOne({ email: u.email });
        if (existing) {
          results.push(`Already exists: ${u.email} (${u.role})`);
          continue;
        }
        const hashed = await hashPassword(u.password);
        await User.create({ ...u, password: hashed });
        results.push(`Created: ${u.email} (${u.role})`);
      }
    } else {
      let totalCreated = 0;

      for (const dept of DEPARTMENTS) {
        const existingCount = await Student.countDocuments({ department: dept.name });
        const needed = 10 - existingCount;

        if (needed <= 0) {
          results.push(`${dept.name}: already has 10 students`);
          continue;
        }

        const batch: any[] = [];
        const usedIds = new Set<string>();

        const existingIds = await Student.find({ department: dept.name }).select("studentId");
        existingIds.forEach((s) => usedIds.add(s.studentId));

        for (let i = 0; i < needed; i++) {
          const num = totalCreated + i + 1;
          let studentId = `STU-${dept.name === "Computer Science" ? "CS" : dept.name.slice(0, 2).toUpperCase()}${String(num).padStart(3, "0")}`;

          while (usedIds.has(studentId)) {
            studentId = `STU-${dept.name.slice(0, 2).toUpperCase()}${String(num + Math.floor(Math.random() * 100)).padStart(3, "0")}`;
          }
          usedIds.add(studentId);

          const firstName = randomItem(FIRST_NAMES);
          const lastName = randomItem(LAST_NAMES);
          const fullName = `${firstName} ${lastName}`;
          const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${num}@school.edu`;
          const level = randomItem(LEVELS);

          batch.push({
            studentId,
            fullName,
            email,
            phone: generatePhone(),
            department: dept.name,
            faculty: dept.faculty,
            level,
            status: "active",
            gender: randomItem(["Male", "Female"]),
          });

          await User.create({
            name: fullName,
            studentId,
            email,
            phone: generatePhone(),
            password: await hashPassword("password123"),
            role: "student",
            department: dept.name,
            faculty: dept.faculty,
            level,
          });
        }

        await Student.insertMany(batch);
        results.push(`${dept.name}: created ${needed} students`);
        totalCreated += needed;
      }

      results.push(`Total: ${totalCreated} students created`);
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
