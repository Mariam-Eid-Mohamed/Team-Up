import React, { useState, useRef, useEffect } from "react";
import type { MouseEvent } from "react";
import { MessageCircle, Bell, ChevronDown, ChevronUp } from "lucide-react";
import logo from "@/assets/images/removebg-preview.png";

// Interfaces for better type safety
interface NotificationItem {
  id: number;
  courseCode: string;
  user: string;
  color: string;
}

const InstructorNavbar: React.FC = () => {
  const [isNotifyOpen, setIsNotifyOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotifyOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 md:px-6 bg-[#83CDC4]">
      
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img
          src={logo}
          alt="logo"
          className="h-8 sm:h-9 md:h-10 w-auto max-h-12"
        />
      </div>

      {/* Nav items */}
      <div className="flex items-center gap-3 sm:gap-6 text-black relative">
        <a href="/home" className="text-sm font-medium hover:underline whitespace-nowrap">
    Home
  </a>

        {/* Messenger */}
        <MessageCircle className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity" />

        {/* Notifications Trigger */}
        <div className="relative" ref={dropdownRef}>
          <div 
            className="relative cursor-pointer p-1"
            onClick={() => setIsNotifyOpen(!isNotifyOpen)}
          >
            <Bell className={`w-5 h-5 transition-transform ${isNotifyOpen ? 'scale-110' : ''}`} />
            {/* Red dot badge (optional) */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </div>

          {/* RESPONSIVE DROPDOWN MENU */}
          {isNotifyOpen && (
            <div className="absolute right-[-40px] sm:right-0 mt-3 w-[290px] sm:w-[340px] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
              
              {/* Section: Class Invitations */}
              <div className="border-b border-gray-100">
                <div className="flex items-center justify-between p-3 bg-gray-50/80">
                  <h3 className="font-bold text-[13px] text-gray-800">Class invitations</h3>
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                </div>
                <div className="p-4">
                  <p className="text-xs leading-relaxed text-gray-600 mb-4">
                    <span className="font-bold text-gray-900">Nourhan Ihab</span> has invited you to join <span className="italic">Intro to Programming</span>
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-[#2D7A74] text-white text-xs font-semibold py-2 rounded shadow-sm hover:bg-[#23615c] transition-colors">
                      Join
                    </button>
                    <button className="flex-1 border border-[#2D7A74] text-[#2D7A74] text-xs font-semibold py-2 rounded hover:bg-teal-50 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              </div>

              {/* Section: Coursework */}
              <div className="border-b border-gray-100">
                <div className="flex items-center justify-between p-3 bg-gray-50/80">
                  <h3 className="font-bold text-[13px] text-gray-800">Coursework</h3>
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                </div>
                
                {/* Coursework List */}
                <div className="divide-y divide-gray-50">
                  <div className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className="bg-[#0095FF] text-[10px] text-white font-bold px-2 py-1 rounded shadow-sm min-w-[55px] text-center">
                      CS480
                    </div>
                    <p className="text-[12px] text-gray-600 group-hover:text-black">
                      <span className="font-semibold text-gray-900">Ahmed Abdelaziz</span> added new coursework!
                    </p>
                  </div>

                  <div className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className="bg-[#9A89FF] text-[10px] text-white font-bold px-2 py-1 rounded shadow-sm min-w-[55px] text-center">
                      CS455
                    </div>
                    <p className="text-[12px] text-gray-600 group-hover:text-black">
                      <span className="font-semibold text-gray-900">Nourhan Ihab</span> added new coursework!
                    </p>
                  </div>
                </div>
              </div>

              {/* Collapsed Items */}
              <div className="px-3 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors">
                <span className="font-bold text-[13px] text-gray-800">Chat</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <div className="px-3 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors">
                <span className="font-bold text-[13px] text-gray-800">Teams</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="flex items-center gap-1 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold shadow-sm group-hover:ring-2 ring-white/50 transition-all">
            M
          </div>
          <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
        </div>
      </div>
    </nav>
  );
};

export default InstructorNavbar;