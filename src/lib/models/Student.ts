import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    dateOfBirth: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    department: { type: String, required: true },
    faculty: { type: String, required: true },
    level: { type: String, required: true },
    address: { type: String },
    photo: { type: String },
    status: { type: String, enum: ["active", "graduated", "suspended", "expelled"], default: "active" },
    enrollmentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Student || mongoose.model("Student", StudentSchema);
