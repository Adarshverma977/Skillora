import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const entryApi = axios.create({
  baseURL: `${API_BASE_URL}/entries`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the current authentication token to protected requests.
entryApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("skillora-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getEntries = async (params = {}) => {
  const response = await entryApi.get("/", { params });
  return response.data;
};

export const getEntryAnalytics = async () => {
  const response = await entryApi.get("/analytics");
  return response.data;
};


export const getEntryById = async (id) => {
  const response = await entryApi.get(`/${id}`);
  return response.data;
};

export const createEntry = async (entryData) => {
  const response = await entryApi.post("/", entryData);
  return response.data;
};

export const updateEntry = async (id, entryData) => {
  const response = await entryApi.patch(`/${id}`, entryData);
  return response.data;
};

export const deleteEntry = async (id) => {
  const response = await entryApi.delete(`/${id}`);
  return response.data;
};

export default entryApi;
