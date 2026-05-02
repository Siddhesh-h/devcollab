import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <App />
        <Toaster
            position="top-right"
            toastOptions={{
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            }}
        />
    </BrowserRouter>,
);
