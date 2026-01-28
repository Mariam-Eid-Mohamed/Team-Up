import Api from "../Api";

const API_BASE = "/courseworks";

export const createCoursework = (
  classId: string,
  formData: FormData,
  token: string
) => {
  return Api.post(`${API_BASE}/create/${classId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
