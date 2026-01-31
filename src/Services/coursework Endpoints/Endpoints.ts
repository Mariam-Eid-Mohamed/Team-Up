import Api from "../Api";

const API_BASE = "/courseworks";

export const createCoursework = (
  classId: string,
  formData: FormData,
  token: string,
) => {
  return Api.post(`${API_BASE}/create/${classId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateCoursework = (
  courseworkId: string,
  formData: FormData,
  token: string,
) => {
  return Api.patch(`${API_BASE}/update/${courseworkId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteCoursework = (courseworkId: string, token: string) => {
  return Api.delete(`${API_BASE}/delete/${courseworkId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
