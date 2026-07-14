import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { reviewCode } from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", authMiddleware, reviewCode);

export default router;