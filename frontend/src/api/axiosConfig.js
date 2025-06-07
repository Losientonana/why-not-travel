// src/api/axiosConfig.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true, // 중요! 쿠키 전달
});

export default api;
