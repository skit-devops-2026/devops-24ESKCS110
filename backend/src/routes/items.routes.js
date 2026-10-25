import { Router } from "express";
import mongoose from "mongoose";
import { requireAuth } from "../middleware/auth.js";
import { getItemModel, itemTypes } from "../models/KnowledgeItem.js";

const router = Router();
router.use(requireAuth);

const allowedTypes = new Set(Object.keys(itemTypes));
const immutableFields = new Set(["_id", "id", "userId", "createdAt", "updatedAt", "__v", "password"]);

function cleanBody(body, type, isCreate = false) {
  const fields = itemTypes[type].fields;
  const output = {};
  for (const [key, value] of Object.entries(body || {})) {
    if (immutableFields.has(key) || !(key in fields)) continue;
    output[key] = value;
  }
  if (output.projectId === "") output.projectId = null;
  if (output.tags !== undefined && !Array.isArray(output.tags)) {
    throw Object.assign(new Error("tags must be an array of strings."), { statusCode: 400 });
  }
  if (output.tags) output.tags = output.tags.map((tag) => String(tag).trim()).filter(Boolean).slice(0, 50);
  if (isCreate && !Object.keys(output).length) {
    throw Object.assign(new Error("Provide fields for the new record."), { statusCode: 400 });
  }
  return output;
}

function validateProjectId(value) {
  if (value && !mongoose.isValidObjectId(value)) {
    throw Object.assign(new Error("projectId must be a valid MongoDB ObjectId."), { statusCode: 400 });
  }
}

router.get("/:type", async (req, res, next) => {
  try {
    const { type } = req.params;
    if (!allowedTypes.has(type)) return res.status(404).json({ success: false, message: "Unknown collection type." });
    const Model = getItemModel(type);
    const filter = { userId: req.user._id };
    if (req.query.archived !== undefined) filter.archived = req.query.archived === "true";
    if (req.query.favorite !== undefined) filter.favorite = req.query.favorite === "true";
    if (req.query.projectId) {
      validateProjectId(req.query.projectId);
      filter.projectId = req.query.projectId;
    }
    if (req.query.q?.trim()) {
      const term = req.query.q.trim().slice(0, 100);
      const fields = itemTypes[type].search;
      filter.$or = fields.map((field) => ({ [field]: { $regex: escapeRegex(term), $options: "i" } }));
    }
    const page = Math.max(1, Math.min(10000, Number.parseInt(req.query.page || "1", 10) || 1));
    const limit = Math.max(1, Math.min(100, Number.parseInt(req.query.limit || "50", 10) || 50));
    const [items, total] = await Promise.all([
      Model.find(filter).sort({ updatedAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Model.countDocuments(filter)
    ]);
    res.json({ success: true, data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
});

router.post("/:type", async (req, res, next) => {
  try {
    const { type } = req.params;
    if (!allowedTypes.has(type)) return res.status(404).json({ success: false, message: "Unknown collection type." });
    const Model = getItemModel(type);
    const data = cleanBody(req.body, type, true);
    validateProjectId(data.projectId);
    const item = await Model.create({ ...data, userId: req.user._id });
    res.status(201).json({ success: true, message: "Record created.", data: item });
  } catch (error) { next(error); }
});

router.get("/:type/:id", async (req, res, next) => {
  try {
    const { type, id } = req.params;
    if (!allowedTypes.has(type)) return res.status(404).json({ success: false, message: "Unknown collection type." });
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid record ID." });
    const item = await getItemModel(type).findOne({ _id: id, userId: req.user._id }).lean();
    if (!item) return res.status(404).json({ success: false, message: "Record not found." });
    res.json({ success: true, data: item });
  } catch (error) { next(error); }
});

router.patch("/:type/:id", async (req, res, next) => {
  try {
    const { type, id } = req.params;
    if (!allowedTypes.has(type)) return res.status(404).json({ success: false, message: "Unknown collection type." });
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid record ID." });
    const data = cleanBody(req.body, type);
    if (!Object.keys(data).length) return res.status(400).json({ success: false, message: "No editable fields provided." });
    validateProjectId(data.projectId);
    const item = await getItemModel(type).findOneAndUpdate(
      { _id: id, userId: req.user._id }, { $set: data },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ success: false, message: "Record not found." });
    res.json({ success: true, message: "Record updated.", data: item });
  } catch (error) { next(error); }
});

router.delete("/:type/:id", async (req, res, next) => {
  try {
    const { type, id } = req.params;
    if (!allowedTypes.has(type)) return res.status(404).json({ success: false, message: "Unknown collection type." });
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid record ID." });
    const item = await getItemModel(type).findOneAndDelete({ _id: id, userId: req.user._id });
    if (!item) return res.status(404).json({ success: false, message: "Record not found." });
    res.json({ success: true, message: "Record deleted.", id: item._id });
  } catch (error) { next(error); }
});

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default router;
