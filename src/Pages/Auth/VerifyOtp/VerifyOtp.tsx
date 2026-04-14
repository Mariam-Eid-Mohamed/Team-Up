import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import {
  VerifyOtpSchema,
  type VerifyOtpInputs,
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
import { verifyResetOtp, forgotPassword } from "../../../Services/Auth.service";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const form = useForm<VerifyOtpInputs>({
    resolver: zodResolver(VerifyOtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data: VerifyOtpInputs) => {
    try {
      const response = await verifyResetOtp({
        email,
        otp: data.otp,
      });

      navigate("/reset-password", {
        state: {
          email,
          verificationToken: response.verificationToken,
        },
      });
    } catch (error: any) {
      form.setError("otp", {
        message: error.response?.data?.message || "Invalid or expired OTP.",
      });
    }
  };

  const handleResendOtp = async () => {
    try {
      await forgotPassword({ email });
    } catch (error) {
      console.error("Resend OTP failed:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-10 text-left">
        <p className="text-gray-500 mb-2">Welcome back!</p>
        <h3 className="font-bold text-2xl">Verify OTP!</h3>
        <h5 className="text-gray-400 mb-2 text-sm">
          Enter the 6 digit OTP sent to your email
        </h5>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>OTP</FormLabel>
                <FormControl>
                  <Input
                    className="bg-[#f4f4ff]"
                    type="text"
                    placeholder="Enter 6 digit OTP"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col w-full">
            <Button
              type="submit"
              className="w-full py-4 bg-[var(--color-primary-dark)] hover:bg-[var(--color-primary)] cursor-pointer text-white"
            >
              Verify Code
            </Button>
          </div>
        </form>
      </Form>

      <div className="text-center mt-3 text-sm">
        <span className="text-gray-600">Didn’t receive a code? </span>
        <button
          onClick={handleResendOtp}
          className="text-[var(--color-accent)] font-semibold hover:underline"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
