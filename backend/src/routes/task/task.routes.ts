import express from "express";
import {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
} from "../../controllers/task/task.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, createTask);
router.get("/:projectId", authMiddleware, getTasks);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

export default router;
