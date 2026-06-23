import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    credits: { type: Number, required: true },
    department: { type: String, required: true },
    faculty: { type: String, required: true },
    level: { type: String, required: true },
    semester: { type: String, enum: ["First", "Second"], required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
