import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Messages from "./pages/Messages";
import ProjectBoard from "./pages/ProjectBoard";
import Login from "./pages/Login";

function App() {
    const token = localStorage.getItem("token");

    return (
        <Routes>
            {!token && <Route path="/login" element={<Login />} />}

            {token ? (
                <Route element={<AppLayout />}>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/project/:id" element={<ProjectBoard />} />
                </Route>
            ) : (
                <Route path="*" element={<Navigate to="/login" />} />
            )}
        </Routes>
    );
}

export default App;
