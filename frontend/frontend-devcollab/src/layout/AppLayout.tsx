import { type ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import ChatPanel from "../components/chat/ChatPanel";

export default function AppLayout({ children }: { children: ReactNode }) {
    const location = useLocation();

    // Detect if we are on project page
    const isProjectPage = location.pathname.startsWith("/project");

    // Chat toggle
    const [showChat, setShowChat] = useState(true);

    return (
        <div className="h-screen flex bg-gray-50">
            {/* ================= Sidebar ================= */}
            <Sidebar />

            {/* ================= Main ================= */}
            <div className="flex-1 flex overflow-hidden">
                {/* -------- Workspace -------- */}
                <div className="flex-1 overflow-auto px-6 py-5">{children}</div>

                {/* -------- Chat Panel (ONLY project page) -------- */}
                {isProjectPage && showChat && (
                    <div className="w-80 border-l bg-white flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                            <span className="text-sm font-semibold text-gray-700">
                                Team Chat
                            </span>

                            <button
                                onClick={() => setShowChat(false)}
                                className="text-gray-400 hover:text-gray-600 text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Chat */}
                        <ChatPanel />
                    </div>
                )}
            </div>
        </div>
    );
}
