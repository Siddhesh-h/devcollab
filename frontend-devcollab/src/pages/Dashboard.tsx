import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects, createProject } from "../services/project";

type Project = {
    id: string;
    name: string;
};

export default function Dashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Fetch projects
    const fetchProjects = async () => {
        try {
            const data = await getProjects();
            setProjects(data);
        } catch (err) {
            console.log("Error fetching projects");
        }
    };

    // Create project
    const handleCreate = async () => {
        if (!name.trim()) return;

        try {
            setLoading(true);
            await createProject(name);
            setName("");
            fetchProjects();
        } catch (err) {
            console.log("Error creating project");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div>
            {/* ===== Header ===== */}
            <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

            {/* ===== Create Project ===== */}
            <div className="bg-white p-5 rounded-lg shadow mb-6">
                <h2 className="text-sm text-gray-600 mb-3">
                    Create New Project
                </h2>

                <div className="flex gap-3">
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter project name..."
                        className="flex-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <button
                        onClick={handleCreate}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        {loading ? "Creating..." : "Create"}
                    </button>
                </div>
            </div>

            {/* ===== Project List ===== */}
            <div>
                <h2 className="text-lg font-medium mb-4">Your Projects</h2>

                {projects.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                        No projects yet. Create your first one.
                    </p>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        {projects.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => navigate(`/project/${p.id}`)}
                                className="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer transition"
                            >
                                <h3 className="font-semibold text-gray-800">
                                    {p.name}
                                </h3>

                                <p className="text-xs text-gray-500 mt-1">
                                    Click to open board
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
