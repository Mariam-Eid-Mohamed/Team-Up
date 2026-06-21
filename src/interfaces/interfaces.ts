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
  studentCount: number;
  teamsCount: number;
  instructorCount: number;
  memberCount: number;
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

export interface StudentTeamItem {
  classCode: string;
  classColor: string;
  teamName: string;
  courseworkName: string;
}

export interface TeamMember {
  id: string;
  role: string;
  joined_at: string;

  student: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_picture: string | null;
  };
}

export interface ClassMember {
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role: string;
  classRole: string;
  joined_date: string;
}
export interface ClassMembersResponse {
  success: boolean;
  data: {
    admins: ClassMember[];
    instructors: ClassMember[];
    students: ClassMember[];
    class_color?: string;
  };
}
export interface TaskFormData {
  title: string;
  description: string;
  deadline: string;
  assignedTo: string;
  status: string;
}
export interface TaskModalData {
  taskName: string;
  taskDescription: string;
  deliverableType: string;
  deadline: string;
  assignee?: string;
}

export interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initialData?: TaskModalData | null;
  onSubmit: (data: TaskModalData) => void;
  members: TeamMember[];
}
export interface Task {
  id: string;
  name: string;
  status: "To Do" | "In Progress" | "Done";
  deadline: string;
  createdBy: string;
  assignedTo: string | null;
  description: string;
  deliverable?: {
    name: string;
    size: string;
    uploadedAt?: string;
  } | null;
}

export interface TaskDashboardProps {
  tasks?: Task[];
  onViewTask?: (task: any) => void;
  refreshTrigger?: number;
}
