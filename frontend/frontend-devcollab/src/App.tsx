import { Routes, Route, Navigate } from "react-router-dom";

// import Messages from "./layouts/Messages";
import Dashboard from "../src/pages/Dashboard";
import ProjectBoard from "../src/pages/ProjectBoard";
import AppLayout from "../src/layout/AppLayout";
import Messages from "./pages/Messages";

function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                {/* Default */}
                <Route path="/" element={<Navigate to="/dashboard" />} />

                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/messages" element={<Messages />} />

                {/* 🔥 THIS IS MISSING */}
                <Route path="/project/:id" element={<ProjectBoard />} />

                {/* fallback */}
                <Route path="*" element={<Navigate to="/dashboard" />} />
            </Route>
        </Routes>
    );
}

export default App;
