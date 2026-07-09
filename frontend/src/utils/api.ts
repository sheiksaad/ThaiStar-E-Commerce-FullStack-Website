import axios from "axios";

const BASE_URL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD
        ? "https://thaistar-backend.onrender.com/api"
        : "http://localhost:5000/api");

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem("token");
            if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(err);
    }
);

export default api;