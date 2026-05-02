import { Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./layout/AppLayout";

import Dashboard from "./pages/Dashboard";
import Messages from "./pages/Messages";
import ProjectBoard from "./pages/ProjectBoard";

import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
    const token = localStorage.getItem("token");

    return (
        <Routes>
            {/* ================= PUBLIC ROUTES ================= */}
            {!token && (
                <>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* redirect everything to login */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </>
            )}

            {/* ================= PROTECTED ROUTES ================= */}
            {token && (
                <Route element={<AppLayout />}>
                    {/* default */}
                    <Route path="/" element={<Navigate to="/dashboard" />} />

                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/project/:id" element={<ProjectBoard />} />

                    {/* fallback */}
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Route>
            )}
        </Routes>
    );
}

export default App;
