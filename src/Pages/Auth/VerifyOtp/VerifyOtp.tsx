import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  LoginSchema,
  type LoginInputs,
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

import { useState } from "react";
import { loginUser, googleAuth } from "../../../Services/Auth.service";
import { GoogleLogin } from "@react-oauth/google";
import { setToken, setUserId } from "../../../utilis/token";

const Login = () => {
  const form = useForm<LoginInputs>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

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
      if (role === "Student") {
        navigate("/student");
      } else {
        navigate("/instructor");
      }
    } catch (error: any) {
      form.setError("email", {
        message: error.response?.data?.message || "Login failed",
      });
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="w-full">
      {/* Header below logo, aligned left */}
      <div className="mb-10 text-left">
        <p className="text-gray-500 mb-2">Welcome back!</p>
        <h3 className="font-bold text-2xl">Verify OTP!</h3>
        <h5 className="text-gray-400 mb-2 text-sm">Enter the 6 digit OTP sent to your email</h5>
      </div>

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
         
  <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>OTP</FormLabel>
                <FormControl>
                  <Input
                    className="bg-[#f4f4ff]"
                    type="Text"
                    placeholder="Enter 6 digit OTP"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
       


          {/* Submit Button */}
          <div className="flex flex-col w-full">
            {/* Login Button */}
            <Button
               onClick={() => navigate("/reset-password")}
              type="submit"
              className="w-full py-4 bg-[var(--color-primary-dark)] hover:bg-[var(--color-primary)] cursor-pointer text-white"
            >
              Verify Code
            </Button>

           

            {/* Don't have an account? Sign up */}
          </div>
        </form>
      </Form>
      <div className="text-center mt-3 text-sm">
        <span className="text-gray-600">Didnot recieve a code? </span>
        <button
        //   onClick={() => navigate("/forget-password")}
          className="text-[var(--color-accent)] font-semibold hover:underline"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default Login;
