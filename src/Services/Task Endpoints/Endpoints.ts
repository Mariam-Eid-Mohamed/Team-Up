import Api from "../Api";

const API_BASE = "/tasks/teams";
export const createTask = (
  teamId: string,
  token: string,
  formData: FormData,
) => {
  return Api.post(
    `${API_BASE}/${teamId}/tasks`,
    formData,

    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};
