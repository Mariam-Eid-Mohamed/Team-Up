import { Outlet } from "react-router-dom";
import AuthImg from "@/assets/images/authImg_resized.png";
import logo from "@/assets/images/Logo.jpg";
// import "./App.css";

export default function AuthLayout() {
  return (
    <div className="grid md:grid-cols-2  h-screen">
      {/* LEFT IMAGE */}
      <div className="order-2 md:order-1 hidden md:block w-full">
        <img
          src={AuthImg}
          alt="auth image"
          className="w-full  object-cover Auth-IMG"
        />
      </div>
      {/* RIGHT CONTENT */}
      <div className="order-1 md:order-2 flex flex-col justify-center items-center p-6 overflow-auto">
        {/* Logo */}
        <img src={logo} alt="logo" className="mb-8 w-48" />

        {/* Form container */}
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}