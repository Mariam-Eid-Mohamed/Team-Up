import Api from "../Api";

const API_BASE = "/tasks";
export const createTask = (
  teamId: string,
  token: string,
  formData: FormData,
) => {
  return Api.post(
    `${API_BASE}/teams/${teamId}/tasks`,
    formData,

    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};
export const editTask = (teamId: string, token: string, formData: FormData) => {
  return Api.put(`${API_BASE}/${teamId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
