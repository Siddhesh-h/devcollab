import { useState } from "react";
import { api } from "../services/api";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!email || !password) {
            return toast.error("Please fill all fields");
        }

        try {
            setLoading(true);

            await api.post("/auth/register", {
                email,
                password,
            });

            toast.success("Account created 🎉");

            setTimeout(() => {
                window.location.href = "/login";
            }, 800);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Register failed");
        } finally {
            setLoading(false);
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
                        disabled={loading}
                        className={`w-full py-3 rounded-lg text-white transition ${
                            loading
                                ? "bg-indigo-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                    >
                        {loading ? (
                            <div className="flex justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            "Register"
                        )}
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
