import { Outlet } from "react-router-dom";
import Navbar from "../pages/Navbar";
import Sidebar from "../pages/Sidebar";

export default function AppLayout() {
    return (
        <div className="min-h-screen bg-gray-200 flex flex-col">
            {/* Navbar */}
            <Navbar />

            {/* Main Layout */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <Sidebar />

                {/* Page Content */}
                <div className="flex-1">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
