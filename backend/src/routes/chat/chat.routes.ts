import express from "express";
import { getMessages } from "../../controllers/chat/chat.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();

router.get("/:projectId", authMiddleware, getMessages);

export default router;
