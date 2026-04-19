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
        <div>
            {/* Title */}
            <h1 className="text-xl font-semibold text-gray-800 mb-6">
                Projects
            </h1>

            {/* Create Project */}
            <div className="flex gap-2 mb-6">
                <input
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64"
                    placeholder="New project name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <button
                    onClick={createProject}
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm"
                >
                    Create
                </button>
            </div>

            {/* Project List */}
            <div className="grid grid-cols-3 gap-4">
                {projects.map((p: any) => (
                    <div
                        key={p.id}
                        onClick={() => navigate(`/project/${p.id}`)}
                        className="bg-white border border-gray-200 p-4 rounded-xl cursor-pointer hover:shadow-sm transition"
                    >
                        <h2 className="text-sm font-medium text-gray-800">
                            {p.name}
                        </h2>
                    </div>
                ))}
            </div>
        </div>
    );
}
