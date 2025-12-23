import axios from "axios";

const API_BASE = "/api/classes";

export const getUserClasses = async (userId: string, token: string) => {
  return axios.get(`${API_BASE}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createClass = async (
  payload: {
    course_name: string;
    course_code: string;
    year: number;
    course_plan?: string;
  },
  token: string
) => {
  return axios.post(`${API_BASE}/create`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
