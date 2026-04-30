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
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState("");

    const navigate = useNavigate();

    const fetchProject = async () => {
        try {
            const res = await api.get("/projects");
            const found = res.data.find((p: any) => p.id === id);
            setProject(found);
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
        <div className="flex-1 m-10 bg-white rounded-[32px] h-[820px] p-6 shadow">
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
                        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                            {project?.name || "Project"}
                        </h1>
                    </div>
                </div>
            </div>

            {/* ================= CREATE TASK ================= */}
            <div>
                <h2 className="text-gray-600 mb-3">Add Task :</h2>

                <div className="flex gap-3">
                    <input
                        placeholder="Task title"
                        className="flex-1 p-3 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-400"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <button
                        onClick={createTask}
                        className="px-4 py-2 rounded-2xl text-white font-medium bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 transition"
                    >
                        Add
                    </button>
                </div>
            </div>

            {/* ================= KANBAN BOARD ================= */}
            <div className="flex justify-between mt-5">
                <DragDropContext onDragEnd={onDragEnd}>
                    {/* TODO */}
                    <Droppable droppableId="TODO">
                        {(provided) => (
                            <div>
                                <h3 className="p-2">TODO</h3>

                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="bg-gray-200 w-[27rem] h-[35rem] p-3 rounded-2xl overflow-y-auto"
                                >
                                    {grouped["TODO"].length === 0 ? (
                                        <div className="text-sm text-gray-400 text-center mt-6">
                                            No tasks
                                        </div>
                                    ) : (
                                        grouped["TODO"].map((task, index) => (
                                            <Draggable
                                                key={task.id}
                                                draggableId={task.id}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="bg-white p-4 rounded-2xl mb-3 shadow hover:shadow-md transition"
                                                    >
                                                        {task.title}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))
                                    )}

                                    {provided.placeholder}
                                </div>
                            </div>
                        )}
                    </Droppable>

                    {/* IN PROGRESS */}
                    <Droppable droppableId="IN_PROGRESS">
                        {(provided) => (
                            <div>
                                <h3 className="p-2">IN PROGRESS</h3>

                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="bg-gray-200 w-[27rem] h-[35rem] p-3 rounded-2xl overflow-y-auto"
                                >
                                    {grouped["IN_PROGRESS"].length === 0 ? (
                                        <div className="text-sm text-gray-400 text-center mt-6">
                                            No tasks
                                        </div>
                                    ) : (
                                        grouped["IN_PROGRESS"].map(
                                            (task, index) => (
                                                <Draggable
                                                    key={task.id}
                                                    draggableId={task.id}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <div
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="bg-white p-4 rounded-2xl mb-3 shadow hover:shadow-md transition"
                                                        >
                                                            {task.title}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ),
                                        )
                                    )}

                                    {provided.placeholder}
                                </div>
                            </div>
                        )}
                    </Droppable>

                    {/* DONE */}
                    <Droppable droppableId="DONE">
                        {(provided) => (
                            <div>
                                <h3 className="p-2">DONE</h3>

                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="bg-gray-200 w-[27rem] h-[35rem] p-3 rounded-2xl overflow-y-auto"
                                >
                                    {grouped["DONE"].length === 0 ? (
                                        <div className="text-sm text-gray-400 text-center mt-6">
                                            No tasks
                                        </div>
                                    ) : (
                                        grouped["DONE"].map((task, index) => (
                                            <Draggable
                                                key={task.id}
                                                draggableId={task.id}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="bg-white p-4 rounded-2xl mb-3 shadow hover:shadow-md transition"
                                                    >
                                                        {task.title}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))
                                    )}

                                    {provided.placeholder}
                                </div>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
}
