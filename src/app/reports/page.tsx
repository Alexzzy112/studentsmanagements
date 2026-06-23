"use client";

import { useState } from "react";
import { Download, BarChart3, PieChart, LineChart, FileText } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RPieChart, Pie, Cell, LineChart as RLineChart, Line, Legend,
} from "recharts";

const COLORS = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

const enrollmentData = [
  { year: "2020", students: 850, graduated: 720 },
  { year: "2021", students: 920, graduated: 780 },
  { year: "2022", students: 1050, graduated: 890 },
  { year: "2023", students: 1150, graduated: 950 },
  { year: "2024", students: 1250, graduated: 1020 },
  { year: "2025", students: 1380, graduated: 1100 },
];

const deptPerformance = [
  { name: "CS", avgScore: 72, students: 35 },
  { name: "Math", avgScore: 68, students: 20 },
  { name: "Physics", avgScore: 65, students: 15 },
  { name: "Chemistry", avgScore: 70, students: 12 },
  { name: "Biology", avgScore: 74, students: 10 },
  { name: "Engineering", avgScore: 69, students: 8 },
];

const genderDist = [
  { name: "Male", value: 55 },
  { name: "Female", value: 42 },
  { name: "Other", value: 3 },
];

const graduationTrend = [
  { year: "2020", graduated: 720, employed: 580 },
  { year: "2021", graduated: 780, employed: 620 },
  { year: "2022", graduated: 890, employed: 710 },
  { year: "2023", graduated: 950, employed: 780 },
  { year: "2024", graduated: 1020, employed: 850 },
  { year: "2025", graduated: 1100, employed: 920 },
];

export default function ReportsPage() {
  const [reportType, setReportType] = useState("enrollment");
  const [generating, setGenerating] = useState(false);

  const generateReport = () => {
    setGenerating(true);
    setTimeout(() => {
      const { jsPDF } = require("jspdf");
      require("jspdf-autotable");
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Institutional Report", 105, 20, { align: "center" as any });
      doc.setFontSize(10);
      doc.text(`EduManage University - ${reportType.toUpperCase()} Report`, 105, 28, { align: "center" as any });
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 34, { align: "center" as any });
      (doc as any).autoTable({
        head: [["Year", "Students", "Graduated"]],
        body: enrollmentData.map((r) => [r.year, r.students, r.graduated]),
        startY: 42,
        theme: "striped",
      });
      doc.save(`${reportType}-report.pdf`);
      setGenerating(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-[var(--muted)] text-sm">Generate and view institutional reports</p>
        </div>
        <div className="flex gap-2">
          <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="input-field py-2 text-sm min-w-[180px]">
            <option value="enrollment">Enrollment Report</option>
            <option value="department">Department Report</option>
            <option value="performance">Performance Report</option>
            <option value="graduation">Graduation Report</option>
          </select>
          <button onClick={generateReport} disabled={generating} className="btn-primary flex items-center gap-2 text-sm">
            {generating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download size={16} />}
            Generate PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={20} className="text-indigo-500" />
            <h3 className="font-semibold">Enrollment Trends (Bar Chart)</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="year" stroke="var(--muted)" fontSize={12} />
                <YAxis stroke="var(--muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", color: "var(--card-foreground)" }} />
                <Legend />
                <Bar dataKey="students" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Students" />
                <Bar dataKey="graduated" fill="#10b981" radius={[6, 6, 0, 0]} name="Graduated" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieChart size={20} className="text-emerald-500" />
            <h3 className="font-semibold">Gender Distribution (Pie Chart)</h3>
          </div>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RPieChart>
                <Pie data={genderDist} cx="50%" cy="50%" outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
                  {genderDist.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <LineChart size={20} className="text-blue-500" />
            <h3 className="font-semibold">Graduation & Employment (Line Chart)</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RLineChart data={graduationTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="year" stroke="var(--muted)" fontSize={12} />
                <YAxis stroke="var(--muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", color: "var(--card-foreground)" }} />
                <Legend />
                <Line type="monotone" dataKey="graduated" stroke="#4f46e5" strokeWidth={2} name="Graduated" dot={{ fill: "#4f46e5" }} />
                <Line type="monotone" dataKey="employed" stroke="#10b981" strokeWidth={2} name="Employed" dot={{ fill: "#10b981" }} />
              </RLineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={20} className="text-amber-500" />
            <h3 className="font-semibold">Department Performance</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--muted)" fontSize={12} domain={[0, 100]} />
                <YAxis dataKey="name" type="category" stroke="var(--muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", color: "var(--card-foreground)" }} />
                <Bar dataKey="avgScore" fill="#f59e0b" radius={[0, 6, 6, 0]} name="Avg Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Enrollment Report", icon: FileText, desc: "Student enrollment data" },
          { label: "Department Report", icon: BarChart3, desc: "Department statistics" },
          { label: "Performance Report", icon: LineChart, desc: "Academic performance" },
          { label: "Graduation Report", icon: PieChart, desc: "Graduation trends" },
        ].map((item, i) => (
          <button key={i} onClick={() => { setReportType(item.label.split(" ")[0].toLowerCase()); generateReport(); }} className="card p-4 text-left hover:shadow-lg transition-all group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <item.icon size={20} className="text-white" />
            </div>
            <p className="font-medium text-sm">{item.label}</p>
            <p className="text-xs text-[var(--muted)] mt-1">{item.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
