import { Routes, Route } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProjectBoard from "./pages/ProjectBoard";
import ToastContainer from "./components/ui/ToastContainer";

// Layout
import AppLayout from "./layout/AppLayout";

function App() {
    return (
        <>
            <ToastContainer />
            <Routes>
                {/* ================= AUTH ROUTES ================= */}
                {/* These pages DO NOT use AppLayout */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* ================= APP ROUTES ================= */}
                {/* These pages USE AppLayout */}

                <Route
                    path="/dashboard"
                    element={
                        <AppLayout>
                            <Dashboard />
                        </AppLayout>
                    }
                />

                <Route
                    path="/project/:id"
                    element={
                        <AppLayout>
                            <ProjectBoard />
                        </AppLayout>
                    }
                />
            </Routes>
        </>
    );
}

export default App;
