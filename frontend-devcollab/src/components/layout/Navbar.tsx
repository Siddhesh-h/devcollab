import { Bell, Search } from "lucide-react";

export default function Navbar() {
    return (
        <div className="h-16 bg-white border-b flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
                <Search size={18} />
                <input
                    placeholder="Search..."
                    className="outline-none text-sm"
                />
            </div>

            <div className="flex items-center gap-4">
                <Bell />
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
        </div>
    );
}
