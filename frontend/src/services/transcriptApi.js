import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTranscripts = async () => {
  const response = await api.get("/transcripts");
  return response.data;
};

export const createTranscript = async (data) => {
  const response = await api.post("/transcripts", data);
  return response.data;
};

export const updateTranscript = async (id, data) => {
  const response = await api.put(`/transcripts/${id}`, data);
  return response.data;
};

export const deleteTranscript = async (id) => {
  const response = await api.delete(`/transcripts/${id}`);
  return response.data;
};

export default api;
