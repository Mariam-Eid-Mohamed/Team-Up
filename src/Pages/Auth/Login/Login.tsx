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

const Login = () => {
  const form = useForm<LoginInputs>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
const navigate = useNavigate();
  const onSubmit = (data: LoginInputs) => {
    console.log("✅ Login Data:", data);
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input className="bg-[#f4f4ff]" placeholder="john@mail.com" {...field} />
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
                  <Input className="bg-[#f4f4ff]"
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
          <div className="flex items-center gap-2 mb-6">
            <input type="checkbox" className="accent-purple-500" />
            <span className="text-[var(--color-accent)] text-sm">Remember me</span>
          </div>

          {/* Submit Button */}
         <div className="flex flex-col w-full">
  {/* Login Button */}
  <Button
    type="submit"
    className="w-full py-4 bg-[var(--color-primary-dark)] hover:bg-[var(--color-primary)] text-white"
  >
    Login
  </Button>

  {/* Register Button */}
  <Button onClick={() => navigate("/register")}
    type="button"
    className="w-full py-4 mt-2 border-[2px] border-[var(--color-accent)] text-[var(--color-accent)] bg-transparent hover:bg-[var(--color-accent)] hover:text-white"
  >
    Register
  </Button>
</div>

        </form>
      </Form>
    </div>
  );
};

export default Login;
