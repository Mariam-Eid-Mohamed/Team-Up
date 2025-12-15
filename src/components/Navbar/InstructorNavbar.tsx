import { User, MessageCircle, Bell, Menu } from "lucide-react";
import logo from "@/assets/images/Logo.jpg";

// interface NavbarProps {
//   onMenuClick: () => void;
// }

const InstructorNavbar = () => { 
    return ( <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6 bg-[#83CDC4]"> 
    {/* Logo */}
     <div className="flex items-center gap-2"> 
        <img src={logo} alt="logo" className="h-10 md:h-12 lg:h-16 w-auto" /> </div> 
        {/* Nav items */} 
        <div className="flex items-center gap-6 text-black"> <a href="/home" className="text-sm font-medium hover:underline"> Home </a> <MessageCircle className="w-5 h-5 cursor-pointer" /> <Bell className="w-5 h-5 cursor-pointer" /> <User className="w-5 h-5 cursor-pointer" /> </div> </nav> ); };

export default InstructorNavbar;
