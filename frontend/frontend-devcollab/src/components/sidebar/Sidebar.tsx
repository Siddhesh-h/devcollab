// src/components/sidebar/Sidebar.tsx

import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../services/api";

/**
 * Sidebar Component
 * ------------------------------------
 * - Navigation
 * - Project list (dynamic)
 * - Active highlighting
 */

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const [projects, setProjects] = useState<any[]>([]);

    /**
     * Fetch projects from backend
     */
    const fetchProjects = async () => {
        try {
            const res = await api.get("/projects");
            setProjects(res.data);
        } catch (err) {
            console.log("Error fetching projects");
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    /**
     * Check active route
     */
    const isActive = (path: string) => {
        return location.pathname === path;
    };

    /**
     * Check active project
     */
    const isActiveProject = (id: string) => {
        return location.pathname === `/project/${id}`;
    };

    return (
        <div className="w-64 bg-white border-r h-screen flex flex-col">
            {/* ================= LOGO ================= */}
            <div className="px-6 py-5 border-b">
                <h1 className="text-lg font-semibold text-gray-800">
                    DevCollab
                </h1>
            </div>

            {/* ================= NAV ================= */}
            <div className="px-4 py-4 space-y-2">
                {/* Dashboard */}
                <button
                    onClick={() => navigate("/dashboard")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition
            ${
                isActive("/dashboard")
                    ? "bg-gray-100 text-black font-medium"
                    : "text-gray-600 hover:bg-gray-100"
            }`}
                >
                    Dashboard
                </button>
            </div>

            {/* ================= PROJECT LIST ================= */}
            <div className="flex-1 overflow-y-auto px-4">
                <h2 className="text-xs text-gray-500 mb-2 mt-4">Projects</h2>

                <div className="space-y-1">
                    {projects.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => navigate(`/project/${p.id}`)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition
                ${
                    isActiveProject(p.id)
                        ? "bg-gray-100 text-black font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                }`}
                        >
                            {p.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* ================= USER ================= */}
            <div className="border-t px-4 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs">
                    U
                </div>

                <div>
                    <p className="text-sm text-gray-700">User</p>
                </div>
            </div>
        </div>
    );
}
