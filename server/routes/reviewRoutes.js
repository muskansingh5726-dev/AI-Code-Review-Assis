import express from "express";
import multer from "multer";

import authMiddleware from "../middleware/authMiddleware.js";
import { reviewCode } from "../controllers/reviewController.js";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  reviewCode
);

export default router;