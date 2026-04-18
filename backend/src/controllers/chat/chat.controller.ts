import { Response } from "express";
import { prisma } from "../../utils/prisma";
import { AuthRequest } from "../../middleware/auth.middleware";

export const getMessages = async (req: AuthRequest, res: Response) => {
    try {
        const { projectId } = req.params as { projectId: string };

        const messages = await prisma.message.findMany({
            where: { projectId },
            include: { user: true },
            orderBy: { createdAt: "asc" },
        });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching messages" });
    }
};
