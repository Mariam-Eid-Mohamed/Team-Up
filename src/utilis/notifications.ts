export type NotificationType =
  | "CLASS_INVITATION"
  | "MESSAGE"
  | "ANNOUNCEMENT"
  | "INVITATION_STATUS"
  | "COURSEWORK";

export interface NotificationUser {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface NotificationItem {
  _id: string;
  userId: NotificationUser; // recipient (current user)
  type: NotificationType;
  referenceId?: string; // points to announcement/coursework/invitation...
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface GroupedNotifications {
  invitations: NotificationItem[];
  invitationStatus: NotificationItem[];
  coursework: NotificationItem[];
  announcements: NotificationItem[];
  messages: NotificationItem[];
}

export const groupNotifications = (
  all: NotificationItem[],
): GroupedNotifications => {
  return {
    invitations: all.filter((n) => n.type === "CLASS_INVITATION"),
    invitationStatus: all.filter((n) => n.type === "INVITATION_STATUS"),
    coursework: all.filter((n) => n.type === "COURSEWORK"),
    announcements: all.filter((n) => n.type === "ANNOUNCEMENT"),
    messages: all.filter((n) => n.type === "MESSAGE"),
  };
};

// optional: simple time formatter
export const formatNotifTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString(); // you can customize later
};
