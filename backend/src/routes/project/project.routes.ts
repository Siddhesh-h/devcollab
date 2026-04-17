import express from "express";
import {
    createProject,
    getProjects,
    addMember,
} from "../../controllers/project/project.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);
router.post("/add-member", authMiddleware, addMember);

export default router;
