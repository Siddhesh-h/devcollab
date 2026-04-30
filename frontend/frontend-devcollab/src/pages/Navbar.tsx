import { Bell, Settings } from "lucide-react";

export default function Navbar() {
    return (
        <div className="h-16 bg-white shadow px-6 flex justify-between items-center">
            {/* LEFT */}
            <div className="flex items-center gap-6">
                {/* Logo only */}
                <div className="flex items-center justify-center w-16 h-16 scale-125">
                    <img
                        src="../src/assets/logo.png"
                        alt="DevCollab"
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Search */}
                <input
                    className="border rounded-xl px-3 py-1 outline-none"
                    type="text"
                    placeholder="Search"
                />
            </div>

            {/* RIGHT */}
            <div className="flex gap-6">
                <Bell className="text-gray-600 cursor-pointer" />
                <Settings className="text-gray-600 cursor-pointer" />
            </div>
        </div>
    );
}
