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
export const getNotificationType = (n: NotificationItem) =>
  String(n.type || "").toUpperCase();

export const isTeamInvitation = (n: NotificationItem) =>
  getNotificationType(n) === "TEAM_INVITATION";

export const isTeamJoinRequest = (n: NotificationItem) =>
  getNotificationType(n) === "TEAM_JOIN_REQUEST";

export const isTeamRequestAccepted = (n: NotificationItem) =>
  getNotificationType(n) === "TEAM_REQUEST_ACCEPTED";

export const isTeamRequestRejected = (n: NotificationItem) =>
  getNotificationType(n) === "TEAM_REQUEST_REJECTED";

export const isTeamInvitationStatus = (n: NotificationItem) =>
  getNotificationType(n) === "INVITATION_STATUS";

export const isTeamNotification = (n: NotificationItem) => {
  const t = getNotificationType(n);
  return (
    t === "TEAM_INVITATION" ||
    t === "TEAM_JOIN_REQUEST" ||
    t === "TEAM_REQUEST_ACCEPTED" ||
    t === "TEAM_REQUEST_REJECTED" ||
    t === "INVITATION_STATUS"
  );
};

export const isTeamActionable = (n: NotificationItem) => {
  const t = getNotificationType(n);
  return t === "TEAM_INVITATION" || t === "TEAM_JOIN_REQUEST";
};

export const getTeamPrimaryActionLabel = (n: NotificationItem) => {
  if (isTeamJoinRequest(n)) return "Approve";
  if (isTeamInvitation(n)) return "Join";
  return "";
};

export const getTeamSuccessText = (n: NotificationItem) => {
  if (isTeamRequestAccepted(n)) return "Request approved";
  if (isTeamInvitationStatus(n)) return "Invitation accepted";
  return "Accepted";
};

export const getTeamRejectedText = (n: NotificationItem) => {
  if (isTeamRequestRejected(n)) return "Request rejected";
  if (isTeamInvitationStatus(n)) return "Invitation declined";
  return "Rejected";
};
