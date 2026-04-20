// src/pages/Register.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Register() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleRegister = async () => {
        try {
            await api.post("/auth/register", {
                name,
                email,
                password,
            });

            navigate("/"); // go to login
        } catch (err) {
            alert("Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            {/* ================= CARD ================= */}
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                {/* Title */}
                <h1 className="text-2xl font-semibold text-center mb-6">
                    Create Account
                </h1>

                {/* ================= NAME ================= */}
                <div className="mb-4">
                    <label className="text-sm text-gray-600">Full Name</label>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* ================= EMAIL ================= */}
                <div className="mb-4">
                    <label className="text-sm text-gray-600">
                        Email Address
                    </label>
                    <input
                        type="email"
                        placeholder="your@email.com"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {/* ================= PASSWORD ================= */}
                <div className="mb-5">
                    <label className="text-sm text-gray-600">Password</label>
                    <input
                        type="password"
                        placeholder="Create a password"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {/* ================= LOGIN LINK ================= */}
                <div className="flex justify-end mb-5 text-sm">
                    <button
                        onClick={() => navigate("/")}
                        className="text-purple-500 hover:underline"
                    >
                        Already have an account?
                    </button>
                </div>

                {/* ================= BUTTON ================= */}
                <button
                    onClick={handleRegister}
                    className="w-full py-2 rounded-md text-white font-medium bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 transition"
                >
                    Register
                </button>
            </div>
        </div>
    );
}
