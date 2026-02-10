import { Outlet } from "react-router-dom";
import InstructorSidebar from "../Sidebar/InstructorSidebar";
import AppNavbar from "../Navbar/AppNavbar";
import { useEffect, useState } from "react";
import { getToken, getUserId } from "@/utilis/token";
import { fetchUserClassesMapped } from "@/Services/Helpers/classHelpers";
import type { Class } from "@/interfaces/interfaces";

export default function StudentLayout() {
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);

  const refetchClasses = async () => {
    const token = getToken();
    const userId = getUserId();
    if (!token || !userId) return;

    const mapped = await fetchUserClassesMapped(userId, token);
    setClasses(mapped);
  };

  useEffect(() => {
    refetchClasses();
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <InstructorSidebar />

      {/* Overlay for mobile */}
      {/* {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )} */}

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <AppNavbar onClassListChanged={refetchClasses} />

        {/* Content */}
        <main className="pt-14 bg-gray-50 min-h-screen ml-16 lg:ml-64 p-4">
          <Outlet context={{ classes, refetchClasses }} />
        </main>
      </div>
    </div>
  );
}
