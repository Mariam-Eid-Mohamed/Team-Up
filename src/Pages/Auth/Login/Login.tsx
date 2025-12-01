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
          <div className="flex items-center justify-between mb-6">
  {/* Remember me */}
  <label className="flex items-center gap-2">
    <input type="checkbox" className="accent-purple-500" />
    <span className="text-[var(--color-accent)] text-sm">Remember me</span>
  </label>

  {/* Forgot password */}
  <button 
    type="button" 
    className="text-[var(--color-accent)] text-sm hover:underline"
  >
    Forgot password?
  </button>
</div>


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
<Button
  type="button"
  className="w-full py-4 flex items-center justify-center gap-2
             border-2 border-[var(--color-accent)]
             text-[var(--color-accent)]
             bg-transparent
             hover:bg-transparent hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]
             cursor-pointer mt-3"
>
  <img
    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
    alt="Google"
    className="w-5 h-5"
  />
  Sign in with Google
</Button>

{/* Don't have an account? Sign up */}
{/* <div className="text-center mt-3 text-sm">
  <span className="text-gray-600">Don't have an account? </span>
  <button
    onClick={() => navigate("/register")}
    className="text-[var(--color-accent)] font-semibold hover:underline"
  >
    Sign up
  </button>
</div> */}

</div>

        </form>
      </Form>
      {/* Don't have an account? Sign up */}
      <div className="text-center mt-3 text-sm">
  <span className="text-gray-600">Don't have an account? </span>
  <button
    onClick={() => navigate("/register")}
    className="text-[var(--color-accent)] cursor-pointer font-semibold hover:underline"
  >
    Sign up
  </button>
</div>
    </div>
  );
};

export default Login;
