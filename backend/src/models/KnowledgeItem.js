import mongoose from "mongoose";

const commonFields = {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", default: null },
  tags: { type: [String], default: [] },
  favorite: { type: Boolean, default: false },
  archived: { type: Boolean, default: false }
};

const definitions = {
  notes: {
    modelName: "Note",
    fields: {
      title: { type: String, required: true, trim: true, maxlength: 200 },
      content: { type: String, required: true, maxlength: 50000 },
      category: { type: String, trim: true, default: "" },
      ...commonFields
    },
    search: ["title", "content", "category", "tags"]
  },
  resources: {
    modelName: "Resource",
    fields: {
      title: { type: String, required: true, trim: true, maxlength: 200 },
      type: { type: String, required: true, trim: true, maxlength: 60 },
      url: { type: String, required: true, trim: true, maxlength: 2048 },
      description: { type: String, trim: true, default: "", maxlength: 5000 },
      ...commonFields
    },
    search: ["title", "type", "url", "description", "tags"]
  },
  snippets: {
    modelName: "CodeSnippet",
    fields: {
      title: { type: String, required: true, trim: true, maxlength: 200 },
      language: { type: String, required: true, trim: true, maxlength: 80 },
      description: { type: String, trim: true, default: "", maxlength: 5000 },
      code: { type: String, required: true, maxlength: 50000 },
      ...commonFields
    },
    search: ["title", "language", "description", "code", "tags"]
  },
  bugs: {
    modelName: "BugLog",
    fields: {
      title: { type: String, required: true, trim: true, maxlength: 200 },
      error: { type: String, required: true, maxlength: 10000 },
      cause: { type: String, required: true, maxlength: 10000 },
      solution: { type: String, required: true, maxlength: 20000 },
      technology: { type: String, required: true, trim: true, maxlength: 100 },
      resourceLink: { type: String, trim: true, default: "", maxlength: 2048 },
      ...commonFields
    },
    search: ["title", "error", "cause", "solution", "technology", "tags"]
  },
  projects: {
    modelName: "Project",
    fields: {
      title: { type: String, required: true, trim: true, maxlength: 200 },
      description: { type: String, trim: true, default: "", maxlength: 10000 },
      status: { type: String, enum: ["Planned", "Active", "Completed", "Planning", "In Progress"], default: "Planned" },
      ...commonFields
    },
    search: ["title", "description", "status", "tags"]
  }
};

const models = {};
for (const [key, definition] of Object.entries(definitions)) {
  // A separate collection per resource type keeps the API easy to query.
  const schema = new mongoose.Schema(definition.fields, { timestamps: true, versionKey: false });
  schema.index({ userId: 1, updatedAt: -1 });
  models[key] = mongoose.models[definition.modelName] || mongoose.model(definition.modelName, schema);
}

export const itemTypes = definitions;
export function getItemModel(type) {
  return models[type] || null;
}
