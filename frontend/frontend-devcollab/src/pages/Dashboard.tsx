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
        <div className="flex-1 m-10 bg-white rounded-[32px] h-[820px] p-6 shadow">
            {/* Title */}
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                Dashboard
            </h1>

            {/* Create Project Section */}
            <div className="bg-gray-50 p-4 rounded-2xl">
                <h2 className="text-gray-600 mb-3">Create New Project :</h2>

                <div className="flex gap-3">
                    <input
                        placeholder="Enter project name"
                        className="flex-1 p-3 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-400"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <button
                        onClick={createProject}
                        className="px-4 py-2 rounded-2xl text-white font-medium bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 transition"
                    >
                        Create
                    </button>
                </div>

                <div>
                    <h2 className="text-gray-600 mb-3 mt-10">
                        Your Projects :
                    </h2>

                    {projects.length === 0 ? (
                        <div className="text-sm text-gray-400">
                            No projects yet. Create your first project.
                        </div>
                    ) : (
                        <div className="flex items-center mt-5 gap-3">
                            {projects.map((p: any) => (
                                <div
                                    key={p.id}
                                    onClick={() => navigate(`/project/${p.id}`)}
                                    className="border w-[20rem] h-[5rem] text-white font-medium bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 transition rounded-3xl p-3"
                                >
                                    <h3>{p.name}</h3>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
