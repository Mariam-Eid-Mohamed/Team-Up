import { useEffect, useState } from "react";
import { MessageCircle, ChevronDown } from "lucide-react";
import logo from "@/assets/images/removebg-preview.png";
import NotificationsDropdown from "@/components/Navbar/NotificationsDropdown";
import { Link } from "react-router-dom";
import profilePlaceholder from "@/assets/images/profile-placeholder.png";
import { useSessionStore } from "@/store/sessionStore";
import { useProfileStore } from "@/store/ProfileStore/userProfileStore";

export default function AppNavbar({
  onClassListChanged,
}: {
  onClassListChanged?: () => void;
}) {
  const token = useSessionStore((state) => state.token);
  const userId = useSessionStore((state) => state.userId);
  const { fetchProfile, clearProfile } = useProfileStore();
  const { profile } = useProfileStore();

  useEffect(() => {
    if (userId && token) {
      fetchProfile(userId, token);
      return;
    }
    clearProfile();
  }, [userId, token, fetchProfile, clearProfile]);

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


        <NotificationsDropdown onJoinedClass={onClassListChanged} />

        {/* Profile + Dropdown */}
        <div className="relative flex items-center gap-1">
          <Link to={`/student/${userId}/profile`}>
            <img
              src={profile?.profile_picture?.storagePath || profilePlaceholder}
              alt={`profile ${profile?.first_name || ""} ${profile?.last_name || ""}`}
              className="w-8 h-8 rounded-full object-cover shadow-sm ring-2 ring-[#1F6B6B]/40"
            />
          </Link>

          {/* <ChevronDown
            className={`w-5 h-5 cursor-pointer transition-transform`}
          /> */}
        </div>
      </div>
    </nav>
  );
}
