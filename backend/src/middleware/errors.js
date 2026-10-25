export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, _req, res, _next) {
  if (error.name === "ValidationError") {
    return res.status(400).json({ success: false, message: "Validation failed", errors: Object.values(error.errors).map((item) => item.message) });
  }
  if (error.code === 11000) {
    return res.status(409).json({ success: false, message: "A record with this unique value already exists." });
  }
  if (error.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid record ID or field value." });
  }
  if (error.message === "Origin is not allowed by CORS") {
    return res.status(403).json({ success: false, message: error.message });
  }
  console.error(error);
  res.status(500).json({ success: false, message: "Internal server error." });
}
