import axios from "axios";

const API = axios.create({
  baseURL: "https://nilai.vortech.my.id/api", // ganti sesuai backend kamu
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
