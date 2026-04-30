import { useEffect, useState } from "react";
import { Send, Search } from "lucide-react";
import { api } from "../services/api";
import { useChat } from "../hooks/useChat";

type Project = {
    id: string;
    name: string;
};

export default function Messages() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(
        null,
    );
    const [projects, setProjects] = useState<Project[]>([]);

    const { messages, input, setInput, sendMessage, bottomRef, userId } =
        useChat(selectedProject?.id || null);

    const fetchProjects = async () => {
        try {
            const res = await api.get("/projects");
            setProjects(res.data);

            // auto select first project
            if (res.data.length > 0) {
                setSelectedProject(res.data[0]);
            }
        } catch (err) {
            console.log("Error fetching projects");
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);
    return (
        <div className="flex">
            {/* ================= LEFT: CHAT ================= */}
            <div className="bg-white m-10 p-6 w-[50rem] h-[820px] rounded-[32px] shadow flex flex-col justify-between">
                {/* HEADER */}
                <div className="p-2 bg-gray-200 h-[7rem] flex items-center rounded-2xl gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                    <div className="text-lg font-semibold">
                        {selectedProject?.name || "Select Project"}
                    </div>
                </div>

                {/* ================= MESSAGES ================= */}
                <div className="flex-1 overflow-y-auto px-4 space-y-4 mt-4">
                    {messages.map((m) => {
                        const isMe = m.userId === userId;

                        return isMe ? (
                            // OUTGOING
                            <div key={m.id} className="flex justify-end">
                                <div className="flex flex-col items-end">
                                    <div className="bg-gray-100 p-3 rounded-2xl max-w-xs">
                                        {m.content}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // INCOMING
                            <div key={m.id} className="flex items-end gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                                    {m.user?.email?.[0]?.toUpperCase()}
                                </div>

                                <div className="flex flex-col">
                                    <div className="bg-gray-100 p-3 rounded-2xl max-w-xs">
                                        {m.content}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <div ref={bottomRef}></div>
                </div>

                {/* ================= INPUT ================= */}
                <div className="flex items-center">
                    <div className="p-2 ">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-[43rem] border-2 border-white hover:border-gray-500 p-2 rounded-3xl"
                            type="text"
                            placeholder="Send Message"
                        />
                    </div>

                    <div className="border p-[2px] rounded-full bg-gradient-to-r from-purple-500 to-indigo-500">
                        <button
                            onClick={sendMessage}
                            className="bg-white rounded-full p-2 flex items-center justify-center"
                        >
                            <Send className="w-5 h-5 text-purple-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* ================= RIGHT: PROJECT LIST ================= */}
            <div className="bg-white m-10 p-6 w-[30rem] h-[820px] rounded-[32px] shadow">
                {/* SEARCH */}
                <div className="flex gap-2 items-center bg-gray-200 rounded-3xl p-2">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full bg-gray-200 outline-none"
                    />
                    <Search />
                </div>

                {/* PROJECTS */}
                <div className="mt-4 space-y-2">
                    {projects.map((p) => (
                        <div
                            key={p.id}
                            onClick={() => setSelectedProject(p)}
                            className={`p-3 rounded-2xl cursor-pointer flex items-center gap-3 ${
                                selectedProject?.id === p.id
                                    ? "bg-gray-200"
                                    : "hover:bg-gray-100"
                            }`}
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                            <div className="text-sm font-medium">{p.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
