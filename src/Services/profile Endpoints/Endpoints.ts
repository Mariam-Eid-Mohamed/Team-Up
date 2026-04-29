import Api from "../Api";

const API_BASE = "/profile";

export const getStudentProfile = (userId: string, token: string) => {
  return Api.get(`${API_BASE}/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const editStudentProfile = (
  userId: string,
  token: string,
  formData: FormData
) => {
  return Api.patch(`${API_BASE}/${userId}/edit`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};