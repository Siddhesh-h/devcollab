import { useEffect, useState } from "react";

/**
 * Toast type
 */
type Toast = {
    id: string;
    message: string;
};

/**
 * Global event system (simple)
 */
let listeners: any[] = [];

export const showToast = (message: string) => {
    listeners.forEach((cb) => cb(message));
};

/**
 * ToastContainer Component
 * ------------------------------------
 * - Renders all toast notifications
 * - Listens to global showToast calls
 */
export default function ToastContainer() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        const addToast = (message: string) => {
            const id = Date.now().toString();

            const newToast = { id, message };

            setToasts((prev) => [...prev, newToast]);

            // Auto remove after 3s
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, 3000);
        };

        listeners.push(addToast);

        return () => {
            listeners = listeners.filter((l) => l !== addToast);
        };
    }, []);

    return (
        <div className="fixed top-4 right-4 space-y-2 z-50">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className="bg-black text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-slide-in"
                >
                    {t.message}
                </div>
            ))}
        </div>
    );
}
