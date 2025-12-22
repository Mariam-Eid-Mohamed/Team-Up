import { MessageCircle, Bell, Menu, ChevronDown } from "lucide-react";
import logo from "@/assets/images/removebg-preview.png";

const InstructorNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6 bg-[#83CDC4]">
      
      {/* Logo */}
     <div className="flex items-center gap-2">
  <img
    src={logo}
    alt="logo"
    className="h-8 sm:h-9 md:h-10 lg:h-12 xl:h-12 w-auto max-h-12"
  />
</div>


      {/* Nav items */}
      <div className="flex items-center gap-6 text-black">
        <a href="/home" className="text-sm font-medium hover:underline">
          Home
        </a>

        {/* Messenger */}
        <MessageCircle className="w-5 h-5 cursor-pointer" />

        {/* Notifications */}
        <Bell className="w-5 h-5 cursor-pointer" />

        {/* Profile */}
        <div className="flex items-center gap-1 cursor-pointer">
          {/* Circle avatar */}
          <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-semibold">
            M
          </div>

          {/* Dropdown arrow */}
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </nav>
  );
};

export default InstructorNavbar;
