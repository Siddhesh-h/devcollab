import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";
import { AuthRequest } from "../../middleware/auth.middleware";

export const createProject = async (req: AuthRequest, res: Response) => {
    try {
        const { name } = req.body;

        const project = await prisma.project.create({
            data: {
                name,
                members: {
                    create: {
                        userId: req.userId!,
                        role: "ADMIN",
                    },
                },
            },
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: "Error creating project" });
    }
};

export const getProjects = async (req: AuthRequest, res: Response) => {
    try {
        const projects = await prisma.project.findMany({
            where: {
                members: {
                    some: {
                        userId: req.userId,
                    },
                },
            },
            include: {
                members: true,
            },
        });

        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: "Error fetching projects" });
    }
};
