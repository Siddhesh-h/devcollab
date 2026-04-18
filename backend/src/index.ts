import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { prisma } from "./utils/prisma";

import authRoutes from "./routes/auth/auth.routes";
import projectRoutes from "./routes/project/project.routes";
import taskRoutes from "./routes/task/task.routes";
import chatRoutes from "./routes/chat/chat.routes";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket setup
export const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/chat", chatRoutes);

//Socket Logic
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_project", (projectId) => {
        socket.join(projectId);
        console.log(`User joined project ${projectId}`);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });

    socket.on("leave_project", (projectId) => {
        socket.leave(projectId);
        console.log(`User left project ${projectId}`);
    });

    //messages
    socket.on("send_message", async ({ content, projectId, userId }) => {
        const message = await prisma.message.create({
            data: {
                content,
                projectId,
                userId,
            },
        });

        const fullMessage = await prisma.message.findUnique({
            where: { id: message.id },
            include: { user: true },
        });

        io.to(projectId).emit("receive_message", fullMessage);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
