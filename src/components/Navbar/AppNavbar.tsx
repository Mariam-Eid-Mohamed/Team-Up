import { MessageCircle, ChevronDown } from "lucide-react";
import logo from "@/assets/images/removebg-preview.png";
import NotificationsDropdown from "@/components/Navbar/NotificationsDropdown";

export default function AppNavbar({
  onClassListChanged,
}: {
  onClassListChanged?: () => void;
}) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 md:px-6 bg-[#83CDC4]">
      <div className="flex items-center gap-2">
        <img
          src={logo}
          alt="logo"
          className="h-8 sm:h-9 md:h-10 w-auto max-h-12"
        />
      </div>

      <div className="flex items-center gap-3 sm:gap-6 text-black relative">
        <a
          href="/home"
          className="text-sm font-medium hover:underline whitespace-nowrap"
        >
          Home
        </a>

        <MessageCircle className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity" />

        <NotificationsDropdown onJoinedClass={onClassListChanged} />

        <div className="flex items-center gap-1 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
            M
          </div>
          <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
        </div>
      </div>
    </nav>
  );
}
