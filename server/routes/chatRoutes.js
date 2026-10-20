import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { chatWithAI } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", authMiddleware, chatWithAI);

export default router;