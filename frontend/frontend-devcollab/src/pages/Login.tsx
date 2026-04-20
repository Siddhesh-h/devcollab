// src/pages/Login.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await api.post("/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.user.id);

            navigate("/dashboard");
        } catch (err) {
            alert("Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            {/* ================= CARD ================= */}
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                {/* Title */}
                <h1 className="text-2xl font-semibold text-center mb-6">
                    Welcome Back!
                </h1>

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
                <div className="mb-2">
                    <label className="text-sm text-gray-600">Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {/* Forgot password */}
                <div className="text-xs text-gray-500 mb-3">
                    Forgot Password?
                </div>

                {/* ================= REMEMBER + REGISTER ================= */}
                <div className="flex items-center justify-between mb-5 text-sm">
                    <label className="flex items-center gap-2 text-gray-600">
                        <input type="checkbox" className="accent-purple-500" />
                        Remember me
                    </label>

                    <button
                        onClick={() => navigate("/register")}
                        className="text-purple-500 hover:underline"
                    >
                        Create Account
                    </button>
                </div>

                {/* ================= BUTTON ================= */}
                <button
                    onClick={handleLogin}
                    className="w-full py-2 rounded-md text-white font-medium bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 transition"
                >
                    Login
                </button>
            </div>
        </div>
    );
}
