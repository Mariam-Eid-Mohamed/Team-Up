export interface LoginInputs {
  email: string;
  password: string;
}

export interface RegisterInputs {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  role: string;
}

// export interface ResetInputs {
//   otp: string;
//   email: string;
//   password: string;
// }
// export interface ChangePassInputs {
//   password: string;
//   password_new: string;
// }
// export interface ForgetInputs {
//   email: string;
// }
export interface Class {
  id: string;
  name: string;
  code: string;
  description: string;
  year: string;
  studentsCount: number;
  teamsCount: number;
  instructorsCount: number;
  color: string;
  // role:string;
}

export interface User {
  _id: string;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  isAlreadyInClass: boolean;
}

export interface ClassInvitation {
  _id: string;
  classId: string;
  senderId: string;
  receiverId: string;
  status: "pending" | "accepted" | "declined";
  createdAt?: string;
}

export interface Notification {
  _id: string;
  type: string;
  message: string;
  invitationId?: string;
  classId?: string;
  course_name?: string;
  senderId?: string;
  senderName?: string;
  isRead?: boolean;
  createdAt?: string;
}
interface Team {
  id: string;
  courseCode: string; // e.g., "CS101"
  teamName: string; // e.g., "Team Alpha"
  courseName: string; // e.g., "Data Structures"
  color: string; // Tailored color for the badge/text
  hasAccess: boolean;
}
