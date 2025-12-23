export interface LoginInputs {
  email: string;
  password: string;
}

export interface RegisterInputs {
  first_name: string;
  last_name: string;
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
  semester: string;
  studentsCount: number;
  teamsCount: number;
  instructorsCount: number;
  color: string;
  // role:string;
}
