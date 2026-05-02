import { Bell, Search } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");

        // redirect to login
        window.location.href = "/login";
    };

    return (
        <div className="h-16 bg-white border-b flex items-center justify-between px-6">
            {/* LEFT */}
            <div className="flex items-center gap-3">
                <Search size={18} />
                <input
                    placeholder="Search..."
                    className="outline-none text-sm"
                />
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-6 relative">
                <Bell className="cursor-pointer" />

                {/* Avatar */}
                <div
                    onClick={() => setOpen(!open)}
                    className="w-8 h-8 bg-gray-300 rounded-full cursor-pointer"
                ></div>

                {/* Dropdown */}
                {open && (
                    <div className="absolute right-0 top-12 w-40 bg-white shadow rounded-lg border z-50">
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
