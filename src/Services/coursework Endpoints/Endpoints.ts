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

// Get available students for a coursework (students in the class who are not in any team yet)
export const getAvailableStudentsForCoursework = (
  courseworkId: string,
  teamId: string,
  token: string,
) => {
  return Api.get(
    `${API_BASE}/${courseworkId}/available-students/${teamId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
