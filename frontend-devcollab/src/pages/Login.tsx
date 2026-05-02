import { useState } from "react";
import { api } from "../services/api";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            return toast.error("Please fill all fields");
        }

        try {
            setLoading(true);

            const res = await api.post("/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", res.data.token);

            toast.success("Login successful 🎉");

            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 800);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex bg-gray-50">
            {/* LEFT SIDE */}
            <div className="hidden md:flex flex-1 bg-gradient-to-br from-blue-600 to-indigo-700 text-white items-center justify-center">
                <div className="max-w-md text-center">
                    <h1 className="text-4xl font-bold mb-4">DevCollab</h1>
                    <p className="text-lg opacity-90">
                        Collaborate. Build. Deliver faster with your team.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex-1 flex items-center justify-center">
                <div className="w-[380px]">
                    <h2 className="text-2xl font-semibold mb-6">
                        Log in to your account
                    </h2>

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 border rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 border rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className={`w-full py-3 rounded-lg text-white transition ${
                            loading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading ? (
                            <div className="flex justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            "Login"
                        )}
                    </button>

                    <p className="text-sm mt-4">
                        Don’t have an account?{" "}
                        <Link
                            to="/register"
                            className="text-blue-600 font-medium"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
