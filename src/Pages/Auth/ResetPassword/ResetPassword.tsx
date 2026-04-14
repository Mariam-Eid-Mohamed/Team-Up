import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ResetPasswordSchema,
  type ResetPasswordInputs,
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
import { resetPassword } from "../../../Services/Auth.service";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const verificationToken = location.state?.verificationToken || "";

  const form = useForm<ResetPasswordInputs>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordInputs) => {
    try {
      await resetPassword({
        email,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
        verificationToken,
      });

      navigate("/login");
    } catch (error: any) {
      form.setError("confirmPassword", {
        message:
          error.response?.data?.message ||
          "Failed to reset password. Please try again.",
      });
    }
  };

  return (
    <div className="w-full">
      <div className="mb-10 text-left">
        <p className="text-gray-500 mb-2">Welcome back!</p>
        <h3 className="font-bold text-2xl">Reset Your Password!</h3>
        <h5 className="text-gray-400 mb-2 text-sm">
          Create a new password for your account
        </h5>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="newPassword"
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

          <div className="flex flex-col w-full">
            <Button
              type="submit"
              className="w-full py-4 bg-[var(--color-primary-dark)] hover:bg-[var(--color-primary)] cursor-pointer text-white"
            >
              Reset Password
            </Button>
          </div>
        </form>
      </Form>

      <div className="text-center mt-3 text-sm">
        <span className="text-gray-600">Already changed your password? </span>
        <button
          onClick={() => navigate("/login")}
          className="text-[var(--color-accent)] font-semibold hover:underline"
        >
          Login Now
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
