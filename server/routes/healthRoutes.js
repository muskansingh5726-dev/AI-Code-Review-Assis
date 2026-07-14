import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Backend is working perfectly 🚀"
    });
});

export default router;