import express from "express";
import type { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { trainModel, predict } from "../mlservices";

const router = express.Router();
const uploadDir = "uploads/";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/train", upload.single("csv"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No CSV file uploaded" });
    }

    console.log(`Training with file: ${req.file.path}`);
    const status = await trainModel(req.file.path);

    res.json({ success: true, status });
  } catch (err: any) {
    console.error("--- TRAIN ERROR LOG ---");
    console.error(err);
    res.status(500).json({
      success: false,
      error: err?.message || "Internal Error",
      gradioStage: err?.stage,
      gradioTitle: err?.title,
    });
  }
});

router.post("/predict", upload.single("csv"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No CSV file uploaded" });
    }

    const steps = Math.max(1, Number(req.body.steps));

    console.log(`Predicting ${steps} steps with file: ${req.file.path}`);
    const result = await predict(req.file.path, steps);

    res.json({ success: true, result });
  } catch (err: any) {
    console.error("--- GRADIO ERROR LOG ---");
    console.error(err);
    res.status(500).json({
      success: false,
      error: err?.message || "An error occurred",
      gradioStage: err?.stage,
      gradioTitle: err?.title,
      details: "Ensure the CSV header is exactly 'Date' and the file is valid UTF-8.",
    });
  }
});

export default router;