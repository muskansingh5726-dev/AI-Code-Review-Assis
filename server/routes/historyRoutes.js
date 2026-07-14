import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
    saveReview,
    getHistory,
    deleteReview
} from "../controllers/historyController.js";

const router = express.Router();

router.post("/", authMiddleware, saveReview);

router.get("/", authMiddleware, getHistory);

router.delete("/:id", authMiddleware, deleteReview);

export default router;