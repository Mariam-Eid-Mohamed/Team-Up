import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  LoginSchema,
  type LoginInputs,
} from "../../../utilis/Validations/Validations";
import { useSessionStore } from "@/store/sessionStore";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { loginUser, googleAuth } from "../../../Services/Auth.service";
import { GoogleLogin } from "@react-oauth/google";
import { setToken, setUserId } from "../../../utilis/token";

const Login = () => {
  const [loginError, setLoginError] = useState("");
  const form = useForm<LoginInputs>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const setRole = useSessionStore((state) => state.setRole);

  const onGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await googleAuth({
        token: credentialResponse.credential,
      });
      if (response.token) {
        setToken(response.token);
      }
      if (response.data?.user?.id || response.data?.user?._id) {
        setUserId(response.data.user.id || response.data.user._id);
      }
      const role = response.data.user.role;
      setRole(role);

      navigate(role === "Student" ? "/student" : "/instructor");
    } catch (error: any) {
      form.setError("email", {
        message:
          error.response?.data?.message ||
          "Google sign in failed. Please try again.",
      });
      console.error("Google sign in failed:", error);
    }
  };

  const onSubmit = async (data: LoginInputs) => {
    setLoginError("");
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
        rememberMe,
      });
      console.log("Login successful:", response);
      if (response.token) {
        setToken(response.token);
      }
      if (response.data?.user?.id || response.data?.user?._id) {
        setUserId(response.data.user.id || response.data.user._id);
      }
      const role = response.data.user.role;
      setRole(role);
      if (role === "Student") {
        navigate("/student");
      } else {
        navigate("/instructor");
      }
    } catch (error: any) {
      setLoginError(
        error.response?.data?.message || "Invalid email or password.",
      );
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="w-full">
      {/* Header below logo, aligned left */}
      <div className="mb-10 text-left">
        <p className="text-gray-500 mb-2">Welcome back!</p>
        <h3 className="font-bold text-2xl">Login to your account</h3>
      </div>

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input
                    className="bg-[#f4f4ff]"
                    placeholder="john@mail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    className="bg-[#f4f4ff]"
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remember Me */}
          <div className="flex items-center justify-between mb-6">
            {/* Remember me */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-purple-500"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="text-[var(--color-accent)] text-sm">
                Remember me
              </span>
            </label>

            {/* Forgot password */}
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-[var(--color-accent)] font-semibold hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          {loginError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {loginError}
            </div>
          )}
          {/* Submit Button */}
          <div className="flex flex-col w-full">
            {/* Login Button */}
            <Button
              type="submit"
              className="w-full py-4 bg-[var(--color-primary-dark)] hover:bg-[var(--color-primary)] cursor-pointer text-white"
            >
              Login
            </Button>

            {/* Register Button */}
            {/* Sign in with Google */}
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={() => {
                console.log("Login Failed");
                form.setError("email", {
                  message: "Google sign in failed. Please try again.",
                });
              }}
              useOneTap
              text="signin_with" // Optional: shows "Continue with Google"
              size="large" // Optional: 'medium' or 'large'
              width="100%" // Make it full width to match your design
              theme="outline" // Optional: 'outline' or 'filled_blue'
              shape="rectangular" // Optional: 'rectangular' or 'pill' or 'circle'
              logo_alignment="center" // Optional: 'left' or 'center'
            />

            {/* Don't have an account? Sign up */}
          </div>
        </form>
      </Form>
      <div className="text-center mt-3 text-sm">
        <span className="text-gray-600">Don't have an account? </span>
        <button
          onClick={() => navigate("/register")}
          className="text-[var(--color-accent)] font-semibold hover:underline"
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Login;
