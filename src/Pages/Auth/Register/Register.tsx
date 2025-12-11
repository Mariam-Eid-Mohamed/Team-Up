import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  RegisterSchema,
  type RegisterInputs,
} from "../../../utilis/Validations/Validations";

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
import { registerUser, googleAuth } from "../../../Services/Auth.service";

const Register = () => {
  const form = useForm<RegisterInputs>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "Student",
    },
  });

  const navigate = useNavigate();

  const handleGoogleSignUp = async () => {
    try {
      // TODO: Replace this prompt with a real Google OAuth flow that returns an ID token
      const token = window.prompt("Paste Google ID token (for testing):");
      if (!token) return;

      const role = form.getValues("role");

      const response = await googleAuth({
        token,
        role,
      });

      // After a successful Google signup/login, you may want to route by role
      const userRole = response.data.user.role;
      if (userRole === "Student") {
        navigate("/student/home");
      } else {
        navigate("/instructor/home");
      }
    } catch (error: any) {
      form.setError("email", {
        message:
          error.response?.data?.message ||
          "Google sign up failed. Please try again.",
      });
      console.error("Google sign up failed:", error);
    }
  };

  const onSubmit = async (data: RegisterInputs) => {
    try {
      await registerUser({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        username: data.email.split("@")[0],
        password: data.password,
        role: data.role,
        rememberMe: false,
      });

      navigate("/login");
    } catch (error: any) {
      form.setError("email", {
        message: error.response?.data?.message || "Registration failed",
      });
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-3 text-left">
        <p className="text-[var(--color-neutral-700)] text-sm mb-0.5">
          Create your account
        </p>
        <h3 className="font-bold text-xl">Register</h3>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2.5 w-full"
        >
          {/* First Name & Last Name */}
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem className="flex-1 space-y-0.5">
                  <FormLabel className="text-xs">First Name</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-[#f4f4ff] py-1.5 text-sm"
                      placeholder="John"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem className="flex-1 space-y-0.5">
                  <FormLabel className="text-xs">Last Name</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-[#f4f4ff] py-1.5 text-sm"
                      placeholder="Doe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-0.5">
                <FormLabel className="text-xs">Email</FormLabel>
                <FormControl>
                  <Input
                    className="bg-[#f4f4ff] py-1.5 text-sm"
                    placeholder="john@mail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-0.5">
                <FormLabel className="text-xs">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="bg-[#f4f4ff] py-1.5 text-sm"
                    placeholder="Enter password"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-0.5">
                <FormLabel className="text-xs">Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="bg-[#f4f4ff] py-1.5 text-sm"
                    placeholder="Confirm password"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Role */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-0.5">
                <FormLabel className="text-xs">Role</FormLabel>
                <FormControl>
                  <select
                    className="w-full p-1.5 rounded border border-gray-300 bg-[#f4f4ff] text-sm"
                    {...field}
                  >
                    <option value="Instructor">Instructor</option>
                    <option value="Student">Student</option>
                  </select>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Buttons */}
          <div className="flex flex-col w-full pt-1">
            {/* Register Button */}
            <Button
              type="submit"
              className="w-full py-2.5 bg-[var(--color-primary-dark)]
                         hover:bg-[var(--color-primary)] text-white text-sm"
            >
              Register
            </Button>

            {/* Google signup */}
            <Button
              type="button"
              onClick={handleGoogleSignUp}
              className="w-full py-2.5 flex items-center justify-center gap-2
                         border-2 border-[var(--color-accent)]
                         text-[var(--color-accent)]
                         bg-transparent
                         hover:bg-transparent hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]
                         cursor-pointer mt-2"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Sign up with Google
            </Button>

            {/* Already have an account? */}
            <div className="text-center mt-2 text-xs">
              <span className="text-gray-600">Already have an account? </span>
              <button
                onClick={() => navigate("/login")}
                className="text-[var(--color-accent)] font-semibold hover:underline"
              >
                Sign in
              </button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Register;
