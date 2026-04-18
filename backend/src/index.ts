import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth/auth.routes";
import projectRoutes from "./routes/project/project.routes";
import taskRoutes from "./routes/task/task.routes";

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
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
