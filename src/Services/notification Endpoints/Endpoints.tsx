import Api from "../Api";

const API_BASE = "/notifications";

// Fetch all notifications for the current user
export const getNotifications = async (token: string) => {
  return Api.get(API_BASE, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string, token: string) => {
  return Api.patch(`${API_BASE}/${notificationId}/read`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

