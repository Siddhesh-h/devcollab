import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { socket } from "../services/socket"
import Chat from "../components/chat"


type Task = {
    id: string;
    title: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
}
export default function ProjectBoard() {
    const {id} = useParams();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState("");

    const fetchTasks = async () => {
        const res = await api.get(`/tasks/${id}`);
        setTasks(res.data);
    }

    const createTask = async () => {
        await api.post("/tasks", {
            title,
            projectId: id,
        });
        setTitle("");
        fetchTasks();
    };

    useEffect(()=>{
        fetchTasks();

        socket.emit("join_project", id);

        // return () => {
        //     socket.disconnect();
        // }

        return () => {
            socket.emit("leave_project", id);
        };
    }, []);

    const grouped = {
        TODO: tasks.filter((t) => t.status === "TODO"),
        IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS"),
        DONE: tasks.filter((t) => t.status === "DONE"),
    };

    const onDragEnd = async (result : any) => {
        if(!result.destination) return;

        const taskId = result.draggableId;
        const newStatus = result.destination.droppableId;

        await api.put(`/tasks/${taskId}`, {
            status: newStatus,
        })

        fetchTasks();
    }


    useEffect(()=> {
        socket.on("task_created", (task)=> {
            setTasks((prev) => [...prev, task]);
        });

        socket.on("task_updated", (updatedTask) => {
            setTasks((prev) => 
                prev.map((t) => (t.id === updatedTask.id ? updatedTask  : t))
        );
        });

        socket.on("task_deleted", (taskId) => {
            setTasks((prev) => prev.filter((t)=> t.id !== taskId));
        });
        return () => {
            socket.off("task_created");
            socket.off("task_updated");
            socket.off("task_deleted");
        }
    }, []);
    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Kanban Board</h1>

            {/* Create Task */}
            <div className="mb-4">
                <input className="border p-2 mr-2" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)}/>

                <button onClick={createTask} className="bg-green-500 text-white px-4 py-2">Add Task</button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-3 gap-4">
                    {["TODO", "IN_PROGRESS", "DONE"].map((col)=> (
                        <Droppable 
                            droppableId={col} 
                            key={col}
                        >
                            {(provided)=> (
                                <div ref={provided.innerRef}
                                    {...provided.droppableProps} className="bg-gray-100 p-4 rounded min-h-[300px]">
                                    
                                    <h2 className="font-bold mb-2">{col}</h2>

                                    {grouped[col as keyof typeof grouped].map(
                                        (task, index) => (
                                            <Draggable 
                                                draggableId={task.id}
                                                index={index}
                                                key={task.id}
                                            >
                                                {(provided)=> (
                                                    <div 
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="bg-white p-3 mb-2 rounded shadow"
                                                    >
                                                        {task.title}
                                                    </div>
                                                )}
                                            </Draggable>
                                        )
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

            <Chat projectId={id!} />
        </div>
    )
}