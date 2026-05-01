import { LayoutDashboard, FolderKanban, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
    const navigate = useNavigate();

    return (
        <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
            {/* Logo */}
            <div className="p-6 text-xl font-bold border-b border-gray-700">
                DevCollab
            </div>

            {/* Menu */}
            <div className="flex-1 p-4 space-y-2">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800"
                >
                    <LayoutDashboard size={18} />
                    Dashboard
                </button>

                <button
                    onClick={() => navigate("/project")}
                    className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800"
                >
                    <FolderKanban size={18} />
                    Projects
                </button>

                <button
                    onClick={() => navigate("/messages")}
                    className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800"
                >
                    <MessageSquare size={18} />
                    Messages
                </button>
            </div>
        </div>
    );
}
