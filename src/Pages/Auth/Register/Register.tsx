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

const Register = () => {
  const form = useForm<RegisterInputs>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "Student",
    },
  });

  const navigate = useNavigate();

  const onSubmit = (data: RegisterInputs) => {
    console.log("✅ Register Data:", data);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-2 text-left">
        <p className="text-[var(--color-neutral-700)] text-ag/desktop/h3 mb-0.5">
           Create your account
        </p>
        <h3 className="font-bold text-2xl">
         Register
        </h3>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-full">
          {/* First Name & Last Name */}
          <div className="flex gap-1.5">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="flex-1 space-y-0.5">
                  <FormLabel className="text-sm">First Name</FormLabel>
                  <FormControl>
                    <Input className="bg-[#f4f4ff] py-1.5 text-sm" placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="flex-1 space-y-0.5">
                  <FormLabel className="text-sm">Last Name</FormLabel>
                  <FormControl>
                    <Input className="bg-[#f4f4ff] py-1.5 text-sm" placeholder="Doe" {...field} />
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
                <FormLabel className="text-sm">Email</FormLabel>
                <FormControl>
                  <Input className="bg-[#f4f4ff] py-1.5 text-sm" placeholder="john@mail.com" {...field} />
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
                <FormLabel className="text-sm">Password</FormLabel>
                <FormControl>
                  <Input type="password" className="bg-[#f4f4ff] py-1.5 text-sm" placeholder="Enter password" {...field} />
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
                <FormLabel className="text-sm">Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" className="bg-[#f4f4ff] py-1.5 text-sm" placeholder="Confirm password" {...field} />
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
                <FormLabel className="text-sm">Role</FormLabel>
                <FormControl>
                  <select
                    className="w-full p-1.5 rounded border border-gray-300 bg-[#f4f4ff] text-sm"
                    {...field}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Student">Student</option>
                  </select>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Buttons */}
          <div className="flex flex-col w-full">
            <Button
              type="submit"
              className="w-full py-2.5 bg-[var(--color-primary-dark)] hover:bg-[var(--color-primary)] text-white text-sm"
            >
              Register
            </Button>
            <Button onClick={() => navigate("/login")}
              type="button"
              className="w-full py-2.5 mt-1 border-[2px] border-[var(--color-accent)] text-[var(--color-accent)] bg-transparent hover:bg-[var(--color-accent)] hover:text-white text-sm"
            >
              Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Register;
