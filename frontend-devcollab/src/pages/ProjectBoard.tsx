import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTasks, createTask, updateTask } from "../services/task";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

type Task = {
    id: string;
    title: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
};

export default function ProjectBoard() {
    const { id } = useParams();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState("");

    const fetchTasks = async () => {
        if (!id) return;
        const data = await getTasks(id);
        setTasks(data);
    };

    const handleCreate = async () => {
        if (!title.trim() || !id) return;

        await createTask(title, id);
        setTitle("");
        fetchTasks();
    };

    useEffect(() => {
        fetchTasks();
    }, [id]);

    // Group tasks
    const grouped = {
        TODO: tasks.filter((t) => t.status === "TODO"),
        IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS"),
        DONE: tasks.filter((t) => t.status === "DONE"),
    };

    // 🔥 HANDLE DRAG
    const onDragEnd = async (result: any) => {
        if (!result.destination) return;

        const taskId = result.draggableId;
        const newStatus = result.destination.droppableId;

        // Update backend
        await updateTask(taskId, newStatus);

        // Update UI instantly
        setTasks((prev) =>
            prev.map((t) =>
                t.id === taskId ? { ...t, status: newStatus } : t,
            ),
        );
    };

    return (
        <div>
            <h1 className="text-xl font-semibold mb-6">Project Board</h1>

            {/* Create Task */}
            <div className="mb-6 flex gap-3">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="New task..."
                    className="p-3 border rounded-lg w-64"
                />

                <button
                    onClick={handleCreate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                    Add
                </button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-3 gap-4">
                    {Object.entries(grouped).map(([col, items]) => (
                        <Droppable droppableId={col} key={col}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="bg-gray-100 p-4 rounded-lg min-h-[400px]"
                                >
                                    <h2 className="font-semibold mb-3">
                                        {col}
                                    </h2>

                                    <div className="space-y-3">
                                        {items.map((task, index) => (
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
                                                        className="bg-white p-3 rounded-lg shadow cursor-pointer"
                                                    >
                                                        {task.title}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
