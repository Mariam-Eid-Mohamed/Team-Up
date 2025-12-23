import { Outlet } from "react-router-dom";
import AuthImg from "@/assets/images/authImg_resized.png";
import logo from "@/assets/images/Logo.jpg";
// import "./App.css";

export default function AuthLayout() {
  return (
    <div className="h-screen overflow-hidden grid md:grid-cols-2">
      {/* LEFT IMAGE (fixed) */}
      <div className="hidden md:block h-screen">
        <img src={AuthImg} alt="auth" className="h-full w-full object-cover" />
      </div>

      {/* RIGHT SIDE (single scroll container) */}
      <div className="h-screen overflow-y-auto">
        {/* Logo sticky at top */}
        <div className="sticky top-0 bg-white z-10 p-6 flex justify-center">
          <img src={logo} alt="logo" className="w-48" />
        </div>

        {/* Content */}
        <div className="px-6 pb-6 flex justify-center">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
