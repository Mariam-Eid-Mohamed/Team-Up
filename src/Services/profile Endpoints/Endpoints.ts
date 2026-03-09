import Api from "../Api";

const API_BASE = "/profile";

export const getStudentProfile = (userId: string, token: string) => {
  return Api.get(`${API_BASE}/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};