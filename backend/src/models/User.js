import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  password: { type: String, required: true, select: false },
  profileImage: { type: String, trim: true, default: "" }
}, { timestamps: true, versionKey: false });

export default mongoose.model("User", userSchema);
