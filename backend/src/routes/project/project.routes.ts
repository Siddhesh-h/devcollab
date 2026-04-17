import express from "express";
import {
    createProject,
    getProjects,
} from "../../controllers/project/project.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);

export default router;
