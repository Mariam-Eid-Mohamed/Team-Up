import Api from "./Api";

//REGISTER USER
export const registerUser = async (data: {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  role: "Student" | "Instructor";
  rememberMe?: boolean;
}) => {
  const res = await Api.post("/auth/register", data);
  return res.data;
};

//LOGIN USER
export const loginUser = async (data: {
  email: string;
  password: string;
  rememberMe?: boolean;
}) => {
  const res = await Api.post("/auth/login", data);
  return res.data;
};

//SIGN IN WITH GOOGLE
export const googleAuth = async (data: {
  token: string;
  role?: "Student" | "Instructor";
  first_name?: string;
  last_name?: string;
  username?: string;
}) => {
  const res = await Api.post("/auth/google", data);
  return res.data;
};
// FORGOT PASSWORD
export const forgotPassword = async (data: { email: string }) => {
  const res = await Api.post("/auth/forgot-password", data);
  return res.data;
};

// VERIFY RESET OTP
export const verifyResetOtp = async (data: { email: string; otp: string }) => {
  const res = await Api.post("/auth/verify-reset-otp", data);
  return res.data;
};

// RESET PASSWORD
export const resetPassword = async (data: {
  email: string;
  newPassword: string;
  confirmPassword: string;
  verificationToken: string;
}) => {
  const res = await Api.patch("/auth/reset-password", data);
  return res.data;
};
