import { useEffect, useState } from "react";
import { api } from "../services/api";
import { socket } from "../services/socket";


export default function Chat({projectId}: {projectId: string}) {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");

    const userId = localStorage.getItem("userId");

    const fetchMessages = async () => {
        const res = await api.get(`/chat/${projectId}`);
        setMessages(res.data);
    };

    useEffect(()=> {
        fetchMessages();
         socket.on("receive_message", (msg)=> {
            setMessages((prev) => [...prev, msg]);
         });

         return () => {
            socket.off("receive_message");
         };
    }, []);

    const sendMessage = () => {
        socket.emit("send_message", {
            content: input,
            projectId,
            userId,
        });

        setInput("");
    };

    return (
        <div className="border p-4 rounded mt-6">
            <h2 className="font-bold mb-2">Chat</h2>

            <div className="h-40 overflow-y-auto mb-2">
                {messages.map((m) => (
                    <div key={m.id} className="mb-1">
                        <strong>{m.user?.email}: </strong>
                        {m.content}
                    </div>
                ))}
            </div>

            <div className="flex">
                <input className="border flex-1 p-2" value={input} onChange={(e) => setInput(e.target.value)}/>

                <button onClick={sendMessage} className="bg-blue-500 text-white px-4">Send</button>
            </div>
        </div>
    )
}