import axios from "axios";

export const createTask = (
  teamId: string,
  token: string,
  data: {
    name: string;
    description: string;
    deadline: string;
    deliverable_type: string;
    assignee_id?: string;
  },
) => {
  return axios.post(`/api/tasks/teams/${teamId}/tasks`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
