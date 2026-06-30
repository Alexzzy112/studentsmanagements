import mongoose from "mongoose";

const CourseRegistrationSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    courseCode: { type: String, required: true },
    semester: { type: String, enum: ["First", "Second"], required: true },
    academicYear: { type: String, required: true },
    level: { type: String, required: true },
    registeredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

CourseRegistrationSchema.index({ studentId: 1, courseCode: 1, semester: 1, academicYear: 1 }, { unique: true });

export default mongoose.models.CourseRegistration || mongoose.model("CourseRegistration", CourseRegistrationSchema);
