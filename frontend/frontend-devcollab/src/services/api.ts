import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error?.response?.data || error.message);

        // Optional: global alert
        alert(error?.response?.data?.message || "Something went wrong");

        return Promise.reject(error);
    },
);
