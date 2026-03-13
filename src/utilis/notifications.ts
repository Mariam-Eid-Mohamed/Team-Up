export type NotificationType =
  | "CLASS_INVITATION"
  | "MESSAGE"
  | "ANNOUNCEMENT"
  | "INVITATION_STATUS"
  | "COURSEWORK"
  | "TEAM_INVITATION"
  | "TEAM_JOIN_REQUEST"
  | "TEAM_REQUEST_ACCEPTED"
  | "TEAM_REQUEST_REJECTED";

export interface NotificationItem {
  _id: string;
  userId: string | NotificationUser;
  type: NotificationType | string;
  referenceId?: string;
  message: string;
  courseCode?: string | null;
  classColor?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationUser {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
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
