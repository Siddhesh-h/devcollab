import { useState } from "react";
import { api } from "../services/api";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {
            if (!email || !password) {
                return toast.error("Please fill all fields");
            }

            await api.post("/auth/register", {
                email,
                password,
            });

            toast.success("Account created successfully 🎉");

            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Register failed");
        }
    };

    return (
        <div className="h-screen flex bg-gray-50">
            {/* LEFT SIDE */}
            <div className="hidden md:flex flex-1 bg-gradient-to-br from-purple-600 to-indigo-700 text-white items-center justify-center">
                <div className="max-w-md text-center">
                    <h1 className="text-4xl font-bold mb-4">DevCollab</h1>
                    <p className="text-lg opacity-90">
                        Start managing your team projects like a pro.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex-1 flex items-center justify-center">
                <div className="w-[380px]">
                    <h2 className="text-2xl font-semibold mb-6">
                        Create your account
                    </h2>

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 border rounded-lg mb-4 outline-none focus:ring-2 focus:ring-indigo-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 border rounded-lg mb-4 outline-none focus:ring-2 focus:ring-indigo-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        onClick={handleRegister}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Register
                    </button>

                    <p className="text-sm mt-4">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-indigo-600 font-medium"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
