import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Student from "@/lib/models/Student";
import Result from "@/lib/models/Result";
import Department from "@/lib/models/Department";
import Faculty from "@/lib/models/Faculty";
import { hashPassword } from "@/lib/auth";

const DEPARTMENTS: { name: string; code: string; faculty: string }[] = [
  { name: "Computer Science", code: "CS", faculty: "Science" },
  { name: "Mathematics", code: "MTH", faculty: "Science" },
  { name: "Physics", code: "PHY", faculty: "Science" },
  { name: "Chemistry", code: "CHM", faculty: "Science" },
  { name: "Biology", code: "BIO", faculty: "Science" },
  { name: "Engineering", code: "ENG", faculty: "Engineering" },
];

const FACULTIES = [
  { name: "Science", code: "SCI" },
  { name: "Engineering", code: "ENG" },
  { name: "Arts", code: "ART" },
  { name: "Social Sciences", code: "SOC" },
  { name: "Medicine", code: "MED" },
  { name: "Education", code: "EDU" },
];

const COURSES_BY_DEPT: Record<string, { code: string; title: string; credits: number; level: string; semester: "First" | "Second" }[]> = {
  "Computer Science": [
    { code: "CSC101", title: "Intro to Programming", credits: 3, level: "100", semester: "First" },
    { code: "CSC102", title: "Intro to Computing", credits: 2, level: "100", semester: "First" },
    { code: "CSC103", title: "Programming Lab", credits: 1, level: "100", semester: "Second" },
    { code: "CSC104", title: "Discrete Mathematics", credits: 3, level: "100", semester: "Second" },
    { code: "CSC201", title: "Data Structures", credits: 3, level: "200", semester: "First" },
    { code: "CSC202", title: "Object-Oriented Programming", credits: 3, level: "200", semester: "First" },
    { code: "CSC203", title: "Database Systems", credits: 3, level: "200", semester: "Second" },
    { code: "CSC204", title: "Web Development", credits: 2, level: "200", semester: "Second" },
    { code: "CSC301", title: "Algorithms", credits: 3, level: "300", semester: "First" },
    { code: "CSC302", title: "Software Engineering", credits: 3, level: "300", semester: "First" },
    { code: "CSC303", title: "Computer Networks", credits: 3, level: "300", semester: "Second" },
    { code: "CSC304", title: "Operating Systems", credits: 3, level: "300", semester: "Second" },
    { code: "CSC401", title: "Artificial Intelligence", credits: 3, level: "400", semester: "First" },
    { code: "CSC402", title: "Machine Learning", credits: 3, level: "400", semester: "First" },
    { code: "CSC403", title: "Cybersecurity", credits: 3, level: "400", semester: "Second" },
    { code: "CSC404", title: "Project", credits: 4, level: "400", semester: "Second" },
    { code: "CSC501", title: "Advanced Topics in CS", credits: 3, level: "500", semester: "First" },
    { code: "CSC502", title: "Research Methods", credits: 2, level: "500", semester: "First" },
    { code: "CSC503", title: "Seminar", credits: 2, level: "500", semester: "Second" },
    { code: "CSC504", title: "Thesis", credits: 6, level: "500", semester: "Second" },
  ],
  "Mathematics": [
    { code: "MTH101", title: "Calculus I", credits: 3, level: "100", semester: "First" },
    { code: "MTH102", title: "Algebra", credits: 3, level: "100", semester: "First" },
    { code: "MTH103", title: "Calculus II", credits: 3, level: "100", semester: "Second" },
    { code: "MTH104", title: "Trigonometry", credits: 2, level: "100", semester: "Second" },
    { code: "MTH201", title: "Linear Algebra", credits: 3, level: "200", semester: "First" },
    { code: "MTH202", title: "Statistics", credits: 3, level: "200", semester: "First" },
    { code: "MTH203", title: "Differential Equations", credits: 3, level: "200", semester: "Second" },
    { code: "MTH204", title: "Numerical Analysis", credits: 3, level: "200", semester: "Second" },
    { code: "MTH301", title: "Real Analysis", credits: 3, level: "300", semester: "First" },
    { code: "MTH302", title: "Abstract Algebra", credits: 3, level: "300", semester: "First" },
    { code: "MTH303", title: "Topology", credits: 3, level: "300", semester: "Second" },
    { code: "MTH304", title: "Complex Analysis", credits: 3, level: "300", semester: "Second" },
    { code: "MTH401", title: "Functional Analysis", credits: 3, level: "400", semester: "First" },
    { code: "MTH402", title: "Measure Theory", credits: 3, level: "400", semester: "First" },
    { code: "MTH403", title: "Mathematical Modeling", credits: 3, level: "400", semester: "Second" },
    { code: "MTH404", title: "Project", credits: 4, level: "400", semester: "Second" },
    { code: "MTH501", title: "Advanced Statistics", credits: 3, level: "500", semester: "First" },
    { code: "MTH502", title: "Research Seminar", credits: 2, level: "500", semester: "Second" },
  ],
  "Physics": [
    { code: "PHY101", title: "General Physics I", credits: 3, level: "100", semester: "First" },
    { code: "PHY102", title: "General Physics II", credits: 3, level: "100", semester: "Second" },
    { code: "PHY103", title: "Physics Lab I", credits: 1, level: "100", semester: "Second" },
    { code: "PHY201", title: "Mechanics", credits: 3, level: "200", semester: "First" },
    { code: "PHY202", title: "Electromagnetism", credits: 3, level: "200", semester: "First" },
    { code: "PHY203", title: "Thermodynamics", credits: 3, level: "200", semester: "Second" },
    { code: "PHY204", title: "Waves & Optics", credits: 3, level: "200", semester: "Second" },
    { code: "PHY301", title: "Quantum Mechanics", credits: 3, level: "300", semester: "First" },
    { code: "PHY302", title: "Statistical Physics", credits: 3, level: "300", semester: "First" },
    { code: "PHY303", title: "Nuclear Physics", credits: 3, level: "300", semester: "Second" },
    { code: "PHY304", title: "Solid State Physics", credits: 3, level: "300", semester: "Second" },
    { code: "PHY401", title: "Astrophysics", credits: 3, level: "400", semester: "First" },
    { code: "PHY402", title: "Electrodynamics", credits: 3, level: "400", semester: "First" },
    { code: "PHY403", title: "Project", credits: 4, level: "400", semester: "Second" },
    { code: "PHY501", title: "Advanced Quantum Theory", credits: 3, level: "500", semester: "First" },
    { code: "PHY502", title: "Thesis", credits: 6, level: "500", semester: "Second" },
  ],
  "Chemistry": [
    { code: "CHM101", title: "General Chemistry I", credits: 3, level: "100", semester: "First" },
    { code: "CHM102", title: "General Chemistry II", credits: 3, level: "100", semester: "Second" },
    { code: "CHM103", title: "Chemistry Lab I", credits: 1, level: "100", semester: "Second" },
    { code: "CHM201", title: "Organic Chemistry", credits: 3, level: "200", semester: "First" },
    { code: "CHM202", title: "Inorganic Chemistry", credits: 3, level: "200", semester: "First" },
    { code: "CHM203", title: "Physical Chemistry", credits: 3, level: "200", semester: "Second" },
    { code: "CHM204", title: "Analytical Chemistry", credits: 3, level: "200", semester: "Second" },
    { code: "CHM301", title: "Biochemistry", credits: 3, level: "300", semester: "First" },
    { code: "CHM302", title: "Polymer Chemistry", credits: 3, level: "300", semester: "First" },
    { code: "CHM303", title: "Spectroscopy", credits: 3, level: "300", semester: "Second" },
    { code: "CHM304", title: "Environmental Chemistry", credits: 3, level: "300", semester: "Second" },
    { code: "CHM401", title: "Advanced Organic Chemistry", credits: 3, level: "400", semester: "First" },
    { code: "CHM402", title: "Research Project", credits: 4, level: "400", semester: "Second" },
    { code: "CHM501", title: "Advanced Topics", credits: 3, level: "500", semester: "First" },
    { code: "CHM502", title: "Thesis", credits: 6, level: "500", semester: "Second" },
  ],
  "Biology": [
    { code: "BIO101", title: "General Biology I", credits: 3, level: "100", semester: "First" },
    { code: "BIO102", title: "General Biology II", credits: 3, level: "100", semester: "Second" },
    { code: "BIO103", title: "Biology Lab I", credits: 1, level: "100", semester: "Second" },
    { code: "BIO201", title: "Genetics", credits: 3, level: "200", semester: "First" },
    { code: "BIO202", title: "Cell Biology", credits: 3, level: "200", semester: "First" },
    { code: "BIO203", title: "Ecology", credits: 3, level: "200", semester: "Second" },
    { code: "BIO204", title: "Microbiology", credits: 3, level: "200", semester: "Second" },
    { code: "BIO301", title: "Molecular Biology", credits: 3, level: "300", semester: "First" },
    { code: "BIO302", title: "Immunology", credits: 3, level: "300", semester: "First" },
    { code: "BIO303", title: "Plant Physiology", credits: 3, level: "300", semester: "Second" },
    { code: "BIO304", title: "Animal Physiology", credits: 3, level: "300", semester: "Second" },
    { code: "BIO401", title: "Biotechnology", credits: 3, level: "400", semester: "First" },
    { code: "BIO402", title: "Bioinformatics", credits: 3, level: "400", semester: "First" },
    { code: "BIO403", title: "Project", credits: 4, level: "400", semester: "Second" },
    { code: "BIO501", title: "Advanced Genetics", credits: 3, level: "500", semester: "First" },
    { code: "BIO502", title: "Thesis", credits: 6, level: "500", semester: "Second" },
  ],
  "Engineering": [
    { code: "ENG101", title: "Engineering Mechanics", credits: 3, level: "100", semester: "First" },
    { code: "ENG102", title: "Engineering Drawing", credits: 2, level: "100", semester: "First" },
    { code: "ENG103", title: "Intro to Engineering", credits: 2, level: "100", semester: "Second" },
    { code: "ENG104", title: "Workshop Practice", credits: 1, level: "100", semester: "Second" },
    { code: "ENG201", title: "Strength of Materials", credits: 3, level: "200", semester: "First" },
    { code: "ENG202", title: "Fluid Mechanics", credits: 3, level: "200", semester: "First" },
    { code: "ENG203", title: "Thermodynamics", credits: 3, level: "200", semester: "Second" },
    { code: "ENG204", title: "Electrical Engineering", credits: 3, level: "200", semester: "Second" },
    { code: "ENG301", title: "Structural Analysis", credits: 3, level: "300", semester: "First" },
    { code: "ENG302", title: "Geotechnical Engineering", credits: 3, level: "300", semester: "First" },
    { code: "ENG303", title: "Hydraulics", credits: 3, level: "300", semester: "Second" },
    { code: "ENG304", title: "Engineering Design", credits: 3, level: "300", semester: "Second" },
    { code: "ENG401", title: "Transportation Engineering", credits: 3, level: "400", semester: "First" },
    { code: "ENG402", title: "Environmental Engineering", credits: 3, level: "400", semester: "First" },
    { code: "ENG403", title: "Project", credits: 4, level: "400", semester: "Second" },
    { code: "ENG404", title: "Engineering Management", credits: 2, level: "400", semester: "Second" },
    { code: "ENG501", title: "Advanced Engineering", credits: 3, level: "500", semester: "First" },
    { code: "ENG502", title: "Thesis", credits: 6, level: "500", semester: "Second" },
  ],
};

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

function generateScore(): number {
  const rand = Math.random();
  if (rand < 0.1) return Math.floor(Math.random() * 20) + 20;
  if (rand < 0.3) return Math.floor(Math.random() * 10) + 40;
  if (rand < 0.6) return Math.floor(Math.random() * 10) + 50;
  if (rand < 0.85) return Math.floor(Math.random() * 10) + 60;
  return Math.floor(Math.random() * 10) + 70;
}

function getAdmissionYear(level: string): string {
  const currentYear = 2025;
  const levelNum = parseInt(level);
  const yearOfEntry = currentYear - Math.floor((levelNum - 100) / 100);
  return `${yearOfEntry}/${yearOfEntry + 1}`;
}

function getAcademicYear(level: string): string {
  const currentYear = 2025;
  const levelNum = parseInt(level);
  const yearOffset = Math.floor((levelNum - 100) / 100);
  const year = currentYear - yearOffset;
  return `${year}/${year + 1}`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  const seedStudents = searchParams.get("students") === "true";
  const seedResults = searchParams.get("results") === "true";

  if (key !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const msgs: string[] = [];

    if (!seedStudents && !seedResults) {
      const users = [
        { name: "Admin User", email: "admin@school.edu", password: "password123", role: "admin" as const, department: "Administration", faculty: "Administration" },
        { name: "Head of Department", email: "hod@school.edu", password: "password123", role: "hod" as const, department: "Science", faculty: "Science" },
      ];
      for (const u of users) {
        const existing = await User.findOne({ email: u.email });
        if (existing) { msgs.push(`Already exists: ${u.email} (${u.role})`); continue; }
        const hashed = await hashPassword(u.password);
        await User.create({ ...u, password: hashed });
        msgs.push(`Created: ${u.email} (${u.role})`);
      }
      return NextResponse.json({ success: true, results: msgs });
    }

    if (seedResults) {
      const students = await Student.find({});
      const courses = COURSES_BY_DEPT;
      let totalResults = 0;

      for (const student of students) {
        const deptCourses = courses[student.department] || [];
        const levelCourses = deptCourses.filter((c) => c.level === student.level);
        if (levelCourses.length === 0) continue;

        const existingCount = await Result.countDocuments({ studentId: student.studentId });
        if (existingCount > 0) {
          msgs.push(`${student.studentId}: already has ${existingCount} results`);
          continue;
        }

        const academicYear = getAcademicYear(student.level);
        const results: any[] = [];

        for (const course of levelCourses) {
          const score = generateScore();
          results.push({
            studentId: student.studentId,
            courseCode: course.code,
            courseTitle: course.title,
            credits: course.credits,
            score,
            semester: course.semester,
            academicYear,
            level: student.level,
            department: student.department,
            faculty: student.faculty,
          });
        }

        if (results.length > 0) {
          await Result.insertMany(results);
          totalResults += results.length;
        }
      }

      msgs.push(`Total results created: ${totalResults}`);
      return NextResponse.json({ success: true, results: msgs });
    }

    for (const f of FACULTIES) {
      const existing = await Faculty.findOne({ name: f.name });
      if (!existing) {
        await Faculty.create(f);
        msgs.push(`Faculty created: ${f.name}`);
      }
    }

    for (const d of DEPARTMENTS) {
      const existing = await Department.findOne({ name: d.name });
      if (!existing) {
        await Department.create({ ...d, description: `${d.name} Department` });
        msgs.push(`Department created: ${d.name}`);
      }
    }

    let totalCreated = 0;

    for (const dept of DEPARTMENTS) {
      const existingCount = await Student.countDocuments({ department: dept.name });
      const needed = 10 - existingCount;
      if (needed <= 0) { msgs.push(`${dept.name}: already has 10 students`); continue; }

      const usedIds = new Set<string>();
      const existingIds = await Student.find({ department: dept.name }).select("studentId");
      existingIds.forEach((s) => usedIds.add(s.studentId));

      for (let i = 0; i < needed; i++) {
        const num = totalCreated + i + 1;
        let studentId = `STU-${dept.code}${String(num).padStart(3, "0")}`;
        while (usedIds.has(studentId)) {
          studentId = `STU-${dept.code}${String(num + Math.floor(Math.random() * 100)).padStart(3, "0")}`;
        }
        usedIds.add(studentId);

        const firstName = randomItem(FIRST_NAMES);
        const lastName = randomItem(LAST_NAMES);
        const fullName = `${firstName} ${lastName}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${num}@school.edu`;
        const level = randomItem(LEVELS);

        await Student.create({
          studentId,
          fullName,
          email,
          phone: generatePhone(),
          department: dept.name,
          faculty: dept.faculty,
          level,
          admissionYear: getAdmissionYear(level),
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

      msgs.push(`${dept.name}: created ${needed} students`);
      totalCreated += needed;
    }

    msgs.push(`Total students created: ${totalCreated}`);

    return NextResponse.json({ success: true, results: msgs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
