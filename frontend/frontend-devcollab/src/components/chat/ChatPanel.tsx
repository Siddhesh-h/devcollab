import { useEffect, useRef, useState } from "react";
import { socket } from "../../services/socket";
import { api } from "../../services/api";
import { showToast } from "../ui/ToastContainer";

export default function ChatPanel() {
    const [messages, setMessages] = useState<any[]>([]);
    // Activity feed
    const [input, setInput] = useState("");

    // Auto-scroll reference
    const bottomRef = useRef<HTMLDivElement | null>(null);

    // TEMP: get projectId from URL
    const projectId = window.location.pathname.split("/")[2];

    // TEMP: get userId from localStorage
    const userId = localStorage.getItem("userId");

    /**
     * Fetch chat history from backend
     */
    const fetchMessages = async () => {
        if (!projectId) return;

        try {
            const res = await api.get(`/chat/${projectId}`);
            setMessages(res.data);
        } catch (err) {
            console.log("Error fetching messages");
        }
    };

    /**
     * Send message via socket
     */
    const sendMessage = () => {
        if (!input.trim()) return;

        socket.emit("send_message", {
            content: input,
            projectId,
            userId,
        });

        setInput("");
    };

    /**
     * Initial setup
     */
    useEffect(() => {
        if (!projectId) return;

        fetchMessages();

        // Join project room
        socket.emit("join_project", projectId);

        // Listen for incoming messages
        socket.on("receive_message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        socket.on("task_created", (task) => {
            if (!task?.title) return;
            showToast(`Task created: ${task.title}`);
        });

        socket.on("task_updated", (task) => {
            if (!task?.status) return;
            showToast(`Task moved to ${task.status}`);
        });

        socket.on("task_deleted", () => {
            showToast("Task deleted");
        });

        return () => {
            socket.off("receive_message");
            socket.off("task_created");
            socket.off("task_updated");
            socket.off("task_deleted");
        };
    }, [projectId]);

    /**
     * Auto scroll to bottom on new message
     */
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col h-full">
            {/* ================= Messages ================= */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages.map((m) => (
                    <div key={m.id} className="flex gap-3">
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                            {m.user?.email?.[0]?.toUpperCase() || "U"}
                        </div>

                        {/* Message Content */}
                        <div>
                            <div className="text-xs text-gray-500">
                                {m.user?.email}
                            </div>

                            <div className="text-sm text-gray-800">
                                {m.content}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Scroll anchor */}
                <div ref={bottomRef}></div>
            </div>

            {/* ================= Input ================= */}
            <div className="p-3 border-t">
                <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Message..."
                        className="flex-1 bg-transparent outline-none text-sm"
                    />

                    <button
                        onClick={sendMessage}
                        className="text-blue-500 text-sm font-medium"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
