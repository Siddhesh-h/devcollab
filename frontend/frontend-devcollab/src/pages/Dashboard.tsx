import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const fetchProjects = async () => {
        const res = await api.get("/projects");
        setProjects(res.data);
    };

    const createProject = async () => {
        await api.post("/projects", { name });
        setName("");
        fetchProjects();
    };

    useEffect(() => {
        fetchProjects();
    }, []);
    return (
        <div className="max-w-6xl">
            {/* ================= HEADER ================= */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Dashboard
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Manage your projects and collaborate with your team
                </p>
            </div>

            {/* ================= CREATE PROJECT ================= */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8">
                <h2 className="text-sm font-medium text-gray-700 mb-3">
                    Create New Project
                </h2>

                <div className="flex gap-2">
                    <input
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                        placeholder="Enter project name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <button
                        onClick={createProject}
                        className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
                    >
                        Create
                    </button>
                </div>
            </div>

            {/* ================= PROJECT LIST ================= */}
            <div>
                <h2 className="text-sm font-medium text-gray-700 mb-4">
                    Your Projects
                </h2>

                {projects.length === 0 ? (
                    <div className="text-sm text-gray-400">
                        No projects yet. Create your first project.
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        {projects.map((p: any) => (
                            <div
                                key={p.id}
                                onClick={() => navigate(`/project/${p.id}`)}
                                className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-sm transition"
                            >
                                <h3 className="text-sm font-medium text-gray-800">
                                    {p.name}
                                </h3>

                                {/* Optional subtle info (future use) */}
                                <p className="text-xs text-gray-400 mt-1">
                                    Click to open project
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
