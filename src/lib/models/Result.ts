import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    courseCode: { type: String, required: true },
    courseTitle: { type: String, required: true },
    credits: { type: Number, required: true },
    score: { type: Number, required: true },
    grade: { type: String },
    gradePoint: { type: Number },
    semester: { type: String, enum: ["First", "Second"], required: true },
    academicYear: { type: String, required: true },
    level: { type: String, required: true },
    department: { type: String },
    faculty: { type: String },
  },
  { timestamps: true }
);

ResultSchema.pre("save", function (next) {
  if (this.score >= 70) { this.grade = "A"; this.gradePoint = 5; }
  else if (this.score >= 60) { this.grade = "B"; this.gradePoint = 4; }
  else if (this.score >= 50) { this.grade = "C"; this.gradePoint = 3; }
  else if (this.score >= 45) { this.grade = "D"; this.gradePoint = 2; }
  else if (this.score >= 40) { this.grade = "E"; this.gradePoint = 1; }
  else { this.grade = "F"; this.gradePoint = 0; }
  next();
});

export default mongoose.models.Result || mongoose.model("Result", ResultSchema);
