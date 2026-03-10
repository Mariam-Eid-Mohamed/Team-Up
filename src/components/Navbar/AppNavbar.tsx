import { useEffect, useState } from "react";
import { getStudentProfile } from "@/Services/profile Endpoints/Endpoints";
import { MessageCircle, ChevronDown } from "lucide-react";
import logo from "@/assets/images/removebg-preview.png";
import NotificationsDropdown from "@/components/Navbar/NotificationsDropdown";
import { Link } from "react-router-dom";
import profilePlaceholder from "@/assets/images/profile-placeholder.png";
import { useSessionStore } from "@/store/sessionStore";

export default function AppNavbar({
  onClassListChanged,
}: {
  onClassListChanged?: () => void;
}) {
  const token = useSessionStore((state) => state.token);
  const userId = useSessionStore((state) => state.userId);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [user_id, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (userId && token) {
      getStudentProfile(userId, token)
        .then((res) => {
          const { profile_picture, fullName, user_id } = res.data.data;
          if (profile_picture?.storagePath)
            setAvatarUrl(profile_picture.storagePath);
          if (fullName) setFullName(fullName);
          if (user_id) setUserId(user_id);
        })
        .catch(() => {});
    }
  }, []);

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

        {/* Profile + Dropdown */}
        <div className="relative flex items-center gap-1">
          <Link to={`/student/${user_id}/profile`}>
            <img
              src={avatarUrl ? avatarUrl : profilePlaceholder}
              alt={`profile ${fullName}`}
              className="w-8 h-8 rounded-full object-cover shadow-sm ring-2 ring-[#1F6B6B]/40"
            />
          </Link>

          <ChevronDown
            className={`w-5 h-5 cursor-pointer transition-transform`}
          />
        </div>
      </div>
    </nav>
  );
}
