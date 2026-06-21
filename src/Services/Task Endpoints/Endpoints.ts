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

export const editTask = (taskId: string, token: string, data: any) => {
  return Api.put(`${API_BASE}/${taskId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const deleteTask = (taskId: string, token: string) => {
  return Api.delete(`${API_BASE}/${taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTeamTasks = (
  teamId: string,
  token: string,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
  },
) => {
  return Api.get(`${API_BASE}/team/${teamId}`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
};

export const getTaskDetails = (taskId: string, token: string) => {
  return Api.get(`${API_BASE}/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const uploadDeliverable = (
  taskId: string,
  token: string,
  file: File,
) => {
  const formData = new FormData();
  formData.append("file", file);
  return Api.patch(`${API_BASE}/${taskId}/deliverable`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateTaskStatus = (
  taskId: string,
  token: string,
  status: string,
) => {
  return Api.patch(
    `${API_BASE}/${taskId}/status`,
    { status },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};

export const assignTask = (
  taskId: string,
  token: string,
  assigneeId: string,
) => {
  return Api.patch(
    `${API_BASE}/${taskId}/assign`,
    { assigneeId },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};

export const unassignTask = (taskId: string, token: string) => {
  return Api.patch(
    `${API_BASE}/${taskId}/unassign`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};
