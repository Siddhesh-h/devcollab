import { useEffect, useRef, useState } from "react";
import { socket } from "../services/socket";
import { api } from "../services/api";

type Message = {
    id: string;
    content: string;
    userId: string;
    projectId: string;
    user?: {
        email: string;
    };
};

export const useChat = (projectId: string | null) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");

    const bottomRef = useRef<HTMLDivElement | null>(null);
    const userId = localStorage.getItem("userId");

    /**
     * Fetch messages
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
     * Send message
     */
    const sendMessage = () => {
        if (!input.trim() || !projectId) return;

        socket.emit("send_message", {
            content: input,
            projectId,
            userId,
        });

        setInput("");
    };

    /**
     * Socket setup
     */
    useEffect(() => {
        if (!projectId) return;

        fetchMessages();

        socket.emit("join_project", projectId);

        const handleMessage = (msg: Message) => {
            if (msg.projectId === projectId) {
                setMessages((prev) => [...prev, msg]);
            }
        };

        socket.on("receive_message", handleMessage);

        return () => {
            socket.emit("leave_project", projectId);
            socket.off("receive_message", handleMessage);
        };
    }, [projectId]);

    /**
     * Auto scroll
     */
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return {
        messages,
        input,
        setInput,
        sendMessage,
        bottomRef,
        userId,
    };
};
