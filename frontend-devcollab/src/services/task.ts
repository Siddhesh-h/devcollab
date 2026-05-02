import { api } from "./api";

export const getTasks = async (projectId: string) => {
    const res = await api.get(`/tasks/${projectId}`);
    return res.data;
};

export const createTask = async (title: string, projectId: string) => {
    const res = await api.post("/tasks", { title, projectId });
    return res.data;
};

export const updateTask = async (taskId: string, status: string) => {
    const res = await api.put(`/tasks/${taskId}`, { status });
    return res.data;
};
