import Api from "../Api";

const API_BASE = "/announcements";

// Create a new announcement (Instructor only)
export const createAnnouncement = async (
  classId: string,
  announcement_text: string,
  token: string
) => {
  return Api.post(
    `${API_BASE}/create/${classId}`,
    { announcement_text },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

// Get all announcements for a class
export const getClassAnnouncements = async (classId: string, token: string) => {
  return Api.get(`${API_BASE}/class/${classId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Update an existing announcement (Instructor only)
export const updateAnnouncement = async (
  announcementId: string,
  announcement_text: string,
  token: string
) => {
  return Api.put(
    `${API_BASE}/${announcementId}`,
    { announcement_text },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

// Delete an announcement (Instructor only)
export const deleteAnnouncement = async (
  announcementId: string,
  token: string
) => {
  return Api.delete(`${API_BASE}/${announcementId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

