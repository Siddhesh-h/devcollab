import { useEffect, useState } from "react"
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const fetchProjects =  async () => {
        const res = await api.get("/projects");
        setProjects(res.data);
    };

    const createProject = async () => {
        await api.post("/projects", {name});
        setName("");
        fetchProjects();
    };

    useEffect(()=> {
        fetchProjects();
    }, []);
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Projects</h1>

            <div className="my-4">
                <input className="border p-2 mr-2" placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} />
                <button onClick={createProject} className="bg-blue-500 text-white px-4 py-2">Create</button>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {projects.map((p: any)=> (
                    <div key={p.id} onClick={() => navigate(`/project/${p.id}`)} className="p-4 border rounded shadow cursor-pointer">
                        {p.name}
                    </div>
                ))}
            </div>
        </div>
    )
}