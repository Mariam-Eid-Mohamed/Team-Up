import Api from "../Api";

const API_BASE = "/classes";

export const getUserClasses = async (userId: string, token: string) => {
  return Api.get(`${API_BASE}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createClass = async (
  payload: {
    course_name: string;
    course_code: string;
    year: number;
    course_plan?: string;
    class_color: string; // Required by backend
  },
  token: string
) => {
  return Api.post(`${API_BASE}/create`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
