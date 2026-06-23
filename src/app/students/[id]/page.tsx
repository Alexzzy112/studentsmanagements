"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Printer, Edit3, Mail, Phone, MapPin, GraduationCap, Building2, BookOpen, Download, Calendar, User } from "lucide-react";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function StudentProfilePage() {
  const { id } = useParams();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      const res = await fetch(`/api/students/${id}`);
      const data = await res.json();
      if (res.ok) setStudent(data);
    } catch {} finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  if (loading) return <LoadingSpinner size="lg" />;
  if (!student) return <div className="text-center py-12 text-[var(--muted)]">Student not found</div>;

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/students" className="p-2 rounded-xl hover:bg-[var(--border)] transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Student Profile</h1>
            <p className="text-[var(--muted)] text-sm">View student details and academic information</p>
          </div>
        </div>
        <div className="flex gap-2 print:hidden">
          <button onClick={handlePrint} className="btn-secondary flex items-center gap-2 text-sm">
            <Printer size={16} />
            Print
          </button>
          <Link href={`/students/add?id=${student._id}`} className="btn-primary flex items-center gap-2 text-sm">
            <Edit3 size={16} />
            Edit
          </Link>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-shrink-0 flex flex-col items-center gap-3">
            {student.photo ? (
              <div className="relative group">
                <img src={student.photo} alt={student.fullName} className="w-40 h-48 rounded-2xl object-cover shadow-lg border-2 border-[var(--border)]" />
                <a href={student.photo} download className="absolute bottom-2 right-2 p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 shadow opacity-0 group-hover:opacity-100 transition-opacity">
                  <Download size={16} />
                </a>
              </div>
            ) : (
              <div className="w-40 h-48 rounded-2xl bg-gradient-to-br from-indigo-400 via-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <span className="text-4xl font-bold text-white">
                  {student.fullName?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{student.fullName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-[var(--muted)]">{student.studentId}</span>
                <span className={`badge ${student.status === "active" ? "badge-success" : student.status === "graduated" ? "badge-warning" : "badge-danger"}`}>
                  {student.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background)]">
                <Building2 size={18} className="text-indigo-500" />
                <div>
                  <p className="text-xs text-[var(--muted)]">Faculty</p>
                  <p className="text-sm font-medium">{student.faculty}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background)]">
                <BookOpen size={18} className="text-emerald-500" />
                <div>
                  <p className="text-xs text-[var(--muted)]">Department</p>
                  <p className="text-sm font-medium">{student.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background)]">
                <GraduationCap size={18} className="text-amber-500" />
                <div>
                  <p className="text-xs text-[var(--muted)]">Level</p>
                  <p className="text-sm font-medium">{student.level} Level</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background)]">
                <User size={18} className="text-pink-500" />
                <div>
                  <p className="text-xs text-[var(--muted)]">Gender</p>
                  <p className="text-sm font-medium">{student.gender || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background)]">
                <Calendar size={18} className="text-orange-500" />
                <div>
                  <p className="text-xs text-[var(--muted)]">Date of Birth</p>
                  <p className="text-sm font-medium">{student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background)]">
                <Calendar size={18} className="text-cyan-500" />
                <div>
                  <p className="text-xs text-[var(--muted)]">Admission Year</p>
                  <p className="text-sm font-medium">{student.admissionYear || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background)]">
                <Mail size={18} className="text-blue-500" />
                <div>
                  <p className="text-xs text-[var(--muted)]">Email</p>
                  <p className="text-sm font-medium">{student.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background)]">
                <Phone size={18} className="text-violet-500" />
                <div>
                  <p className="text-xs text-[var(--muted)]">Phone</p>
                  <p className="text-sm font-medium">{student.phone || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background)]">
                <MapPin size={18} className="text-rose-500" />
                <div>
                  <p className="text-xs text-[var(--muted)]">Address</p>
                  <p className="text-sm font-medium">{student.address || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-4">Academic Records</h3>
        <AcademicRecords studentId={student.studentId} />
      </div>
    </div>
  );
}

function AcademicRecords({ studentId }: { studentId: string }) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [studentId]);

  const fetchResults = async () => {
    try {
      const res = await fetch(`/api/results?studentId=${studentId}`);
      const data = await res.json();
      if (res.ok) setResults(data.results || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  const totalGP = results.reduce((sum, r) => sum + (r.gradePoint || 0) * (r.credits || 0), 0);
  const totalCredits = results.reduce((sum, r) => sum + (r.credits || 0), 0);
  const gpa = totalCredits > 0 ? (totalGP / totalCredits).toFixed(2) : "0.00";

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-center">
          <p className="text-2xl font-bold text-indigo-600">{results.length}</p>
          <p className="text-xs text-[var(--muted)]">Courses Taken</p>
        </div>
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-center">
          <p className="text-2xl font-bold text-emerald-600">{totalCredits}</p>
          <p className="text-xs text-[var(--muted)]">Total Credits</p>
        </div>
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-center">
          <p className="text-2xl font-bold text-amber-600">{gpa}</p>
          <p className="text-xs text-[var(--muted)]">GPA</p>
        </div>
      </div>

      {results.length === 0 ? (
        <p className="text-center py-8 text-[var(--muted)]">No academic records found</p>
      ) : (
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Credits</th>
                <th>Score</th>
                <th>Grade</th>
                <th>Semester</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r: any, i: number) => (
                <tr key={i}>
                  <td className="font-medium">{r.courseCode}</td>
                  <td>{r.courseTitle}</td>
                  <td>{r.credits}</td>
                  <td>{r.score}</td>
                  <td><span className={`badge ${r.grade === "A" || r.grade === "B" ? "badge-success" : r.grade === "C" ? "badge-warning" : "badge-danger"}`}>{r.grade}</span></td>
                  <td className="text-sm text-[var(--muted)]">{r.semester}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
