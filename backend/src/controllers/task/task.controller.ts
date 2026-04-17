import { Response } from "express";
import { prisma } from "../../utils/prisma";
import { AuthRequest } from "../../middleware/auth.middleware";

//create
export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, projectId } = req.body;

        const isMember = await prisma.projectMember.findFirst({
            where: {
                projectId,
                userId: req.userId,
            },
        });

        if (!isMember) {
            return res.status(403).json({ message: "Access denied" });
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                status: "TODO",
                projectId,
            },
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Error creating task" });
    }
};

//get
export const getTasks = async (req: AuthRequest, res: Response) => {
    try {
        const { projectId } = req.params as { projectId: string };

        const isMember = await prisma.projectMember.findFirst({
            where: {
                projectId,
                userId: req.userId,
            },
        });

        if (!isMember) {
            return res.status(403).json({ message: "Access denied" });
        }

        const tasks = await prisma.task.findMany({
            where: { projectId },
        });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks" });
    }
};

//update
export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const { title, description, status, assignedTo } = req.body;

        if (assignedTo) {
            const isMember = await prisma.projectMember.findFirst({
                where: {
                    projectId: req.body.projectId,
                    userId: assignedTo,
                },
            });

            if (!isMember) {
                return res.status(400).json({
                    message: "User not part of project",
                });
            }
        }

        const task = await prisma.task.update({
            where: { id },
            data: {
                title,
                description,
                status,
                assignedTo,
            },
        });

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Error updating task" });
    }
};

//delete
export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params as { id: string };

        await prisma.task.delete({
            where: { id },
        });

        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task" });
    }
};
