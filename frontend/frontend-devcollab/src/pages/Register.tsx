import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await api.post("/auth/register", {
                email,
                password,
                name,
            });

            navigate("/");
        } catch (err) {
            alert("Registration failed");
        }
    };
    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-xl shadow w-80">
                <h2 className="text-xl font-bold mb-4">Register</h2>

                <input
                    className="w-full border p-2 mb-3"
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    className="w-full border p-2 mb-3"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="w-full border p-2 mb-3"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleRegister}
                    className="w-full bg-green-500 text-white p-2 rounded"
                >
                    Register
                </button>
            </div>
        </div>
    );
}
