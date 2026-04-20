import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { socket } from "../services/socket";

type Task = {
    id: string;
    title: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
};
export default function ProjectBoard() {
    const { id } = useParams();
    // Store project info
    const [project, setProject] = useState<any>(null);
    // Store current user's role in this project
    const [role, setRole] = useState<string | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState("");

    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const fetchProject = async () => {
        try {
            const res = await api.get("/projects");
            const found = res.data.find((p: any) => p.id === id);
            setProject(found);

            //Find current user's role
            const member = found?.members?.find(
                (m: any) => m.userId === userId,
            );

            setRole(member?.role || null);
        } catch (err) {
            console.log("Error fetching project");
        }
    };

    const fetchTasks = async () => {
        const res = await api.get(`/tasks/${id}`);
        setTasks(res.data);
    };

    const createTask = async () => {
        await api.post("/tasks", {
            title,
            projectId: id,
        });
        setTitle("");
        fetchTasks();
    };

    useEffect(() => {
        if (!id) return;

        // Fetch tasks for current project
        fetchTasks();
        fetchProject();

        // Join correct project room
        socket.emit("join_project", id);

        return () => {
            // Leave previous project room
            socket.emit("leave_project", id);
        };
    }, [id]);

    const grouped = {
        TODO: tasks.filter((t) => t.status === "TODO"),
        IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS"),
        DONE: tasks.filter((t) => t.status === "DONE"),
    };

    const onDragEnd = async (result: any) => {
        if (!result.destination) return;

        const taskId = result.draggableId;
        const newStatus = result.destination.droppableId;

        await api.put(`/tasks/${taskId}`, {
            status: newStatus,
        });

        fetchTasks();
    };

    useEffect(() => {
        if (!id) return;

        const handleCreate = (task: Task) => {
            setTasks((prev) => [...prev, task]);
        };

        const handleUpdate = (updatedTask: Task) => {
            setTasks((prev) =>
                prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
            );
        };

        const handleDelete = (taskId: string) => {
            setTasks((prev) => prev.filter((t) => t.id !== taskId));
        };

        socket.on("task_created", handleCreate);
        socket.on("task_updated", handleUpdate);
        socket.on("task_deleted", handleDelete);

        return () => {
            socket.off("task_created", handleCreate);
            socket.off("task_updated", handleUpdate);
            socket.off("task_deleted", handleDelete);
        };
    }, [id]);
    return (
        <div className="h-full flex flex-col">
            {/* ================= HEADER ================= */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                    {/* Left: Back + Project Name */}
                    <div className="flex items-center gap-3">
                        {/* Back Button */}
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            ← Back
                        </button>

                        {/* Project Name */}
                        <h1 className="text-lg font-semibold text-gray-800">
                            {project?.name || "Project"}
                        </h1>
                    </div>
                </div>
            </div>

            {role === "MEMBER" && (
                <div className="text-xs text-gray-500 mb-4">
                    You have view-only access in this project
                </div>
            )}

            {/* ================= CREATE TASK ================= */}
            {role === "ADMIN" && (
                <div className="flex gap-2 mb-6">
                    <input
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-gray-300"
                        placeholder="Task title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <button
                        onClick={createTask}
                        className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
                    >
                        Add
                    </button>
                </div>
            )}

            {/* ================= KANBAN BOARD ================= */}
            <div className="flex-1 overflow-x-auto pb-2">
                <DragDropContext onDragEnd={onDragEnd}>
                    {/* Horizontal board (Trello style) */}
                    <div className="flex gap-4">
                        {["TODO", "IN_PROGRESS", "DONE"].map((col) => (
                            <Droppable droppableId={col} key={col}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="w-72 bg-gray-100/60 rounded-xl p-3 flex flex-col"
                                    >
                                        {/* Column Title */}
                                        <h2 className="text-sm font-semibold text-gray-700 mb-3">
                                            {col.replace("_", " ")}
                                        </h2>

                                        {/* Tasks */}
                                        {grouped[col as keyof typeof grouped]
                                            .length === 0 ? (
                                            <div className="text-xs text-gray-400 text-center mt-6">
                                                No tasks
                                            </div>
                                        ) : (
                                            grouped[
                                                col as keyof typeof grouped
                                            ].map((task, index) => (
                                                <Draggable
                                                    draggableId={task.id}
                                                    index={index}
                                                    key={task.id}
                                                >
                                                    {(provided) => (
                                                        <div
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="bg-white rounded-lg p-3 mb-2 shadow-sm border border-gray-200 text-sm hover:shadow-md hover:-translate-y-[1px] transition cursor-pointer"
                                                        >
                                                            {task.title}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                        )}

                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
}
