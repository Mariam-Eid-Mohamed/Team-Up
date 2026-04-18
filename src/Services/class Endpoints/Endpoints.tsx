/* eslint-disable react-refresh/only-export-components */
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
  token: string,
) => {
  return Api.post(`${API_BASE}/create`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateClass = async (
  classId: string,
  payload: {
    course_name: string;
    course_code: string;
    year: number;
    course_plan?: string;
    class_color: string;
  },
  token: string,
) => {
  return Api.patch(`${API_BASE}/edit/${classId}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteClass = async (classId: string, token: string) => {
  return Api.delete(`${API_BASE}/delete/${classId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const joinClass = async (classCode: string, token: string) => {
  return Api.post(
    `${API_BASE}/join`,
    { class_code: classCode },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};

// Search users by username for class invitation
export const searchUsersForInvitation = async (
  classId: string,
  username: string,
  token: string,
) => {
  return Api.get(
    `${API_BASE}/${classId}/search-users?username=${encodeURIComponent(
      username,
    )}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};

// Invite user to class
export const inviteUserToClass = async (
  classId: string,
  userId: string,
  token: string,
) => {
  return Api.post(
    `${API_BASE}/${classId}/invite`,
    { userId },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};

// Get class code
export const getClassCode = async (classId: string, token: string) => {
  return Api.get(`${API_BASE}/${classId}/class-code`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get all class members (instructors and students)
export const getClassMembers = async (classId: string, token: string) => {
  return Api.get(`${API_BASE}/${classId}/members`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Respond to invitation (accept or decline)
export const respondToInvitation = async (
  invitationId: string,
  action: "accept" | "decline",
  token: string,
) => {
  return Api.patch(
    `${API_BASE}/invitations/${invitationId}`,
    { action },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};
export const GetClassPosts = (classId: string, token: string) => {
  return Api.get(`${API_BASE}/${classId}/posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get existing teams for a coursework (unlocked by default; use locked=true for closed teams)
export const getCourseworkTeams = async (
  classId: string,
  courseworkId: string,
  token: string,
  options?: { locked?: boolean },
) => {
  const locked = options?.locked === true ? "true" : "false";
  return Api.get(
    `${API_BASE}/${classId}/courseworks/${courseworkId}/teams?locked=${locked}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};

// Assign instructor as class admin
export const assignClassAdmin = async (
  classId: string,
  instructorId: string,
  token: string,
) => {
  return Api.patch(
    `${API_BASE}/${classId}/instructors/${instructorId}/role`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};
export const removeStudentFromClass = async (
  classId: string,
  studentId: string,
  token: string,
) => {
  return Api.delete(`/classes/${classId}/members/${studentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Student leave class
export const leaveClass = async (classId: string, token: string) => {
  return Api.delete(`${API_BASE}/${classId}/members/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get class instructors
export const getClassInstructors = async (classId: string, token: string) => {
  return Api.get(`${API_BASE}/${classId}/instructors`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Create a new section
export const createSection = async (
  classId: string,
  payload: { section_name: string; instructorIds: string[] },
  token: string,
) => {
  return Api.post(`${API_BASE}/${classId}/sections`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
