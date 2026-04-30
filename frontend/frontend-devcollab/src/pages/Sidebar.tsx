import {
    LayoutDashboard,
    Send,
    Compass,
    ChevronDown,
    User,
    Bookmark,
    Settings,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    return (
        <div className="bg-white w-[300px] h-[820px] p-4 m-10 shadow rounded-[32px] flex flex-col">
            <div className="flex-1 overflow-y-auto">
                <div className="border-b">
                    <div
                        onClick={() => navigate("/dashboard")}
                        className="flex p-3 gap-2 cursor-pointer hover:bg-gray-200 rounded-3xl m-4"
                    >
                        <LayoutDashboard />
                        Dashoard
                    </div>
                    <div
                        onClick={() => navigate("/messages")}
                        className="flex p-3 gap-2 cursor-pointer hover:bg-gray-200 rounded-3xl m-4"
                    >
                        <Send />
                        Messages
                    </div>
                </div>

                <div>
                    <div
                        onClick={() => setOpen(!open)}
                        className="flex justify-between p-3 m-4 cursor-pointer"
                    >
                        <h3>User Profile</h3>
                        <ChevronDown
                            className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                        />
                    </div>

                    {open && (
                        <div>
                            <div className="flex p-3 gap-2 cursor-pointer hover:bg-gray-200 rounded-3xl m-4">
                                <User />
                                Visit Profile
                            </div>
                            <div className="flex p-3 gap-2 cursor-pointer hover:bg-gray-200 rounded-3xl m-4">
                                <Bookmark />
                                Saved
                            </div>
                            <div className="flex p-3 gap-2 cursor-pointer hover:bg-gray-200 rounded-3xl m-4">
                                <Settings />
                                Settings
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex bg-gray-200 h-[70px] p-3 rounded-3xl items-center gap-3 mt-4">
                <div className="relative w-12 h-12">
                    <img
                        src="../src/assets/hero.png"
                        alt=""
                        className="w-full h-full rounded-full object-fit-cover"
                    />
                </div>
                <div>Siddhesh</div>
            </div>
        </div>
    );
}
