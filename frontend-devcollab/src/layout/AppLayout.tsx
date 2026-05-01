import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

export default function AppLayout() {
    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main */}
            <div className="flex-1 flex flex-col">
                <Navbar />

                <div className="p-6 bg-gray-100 min-h-screen">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
