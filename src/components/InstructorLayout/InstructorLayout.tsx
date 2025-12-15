import { useState } from "react";
import { Outlet } from "react-router-dom";
import InstructorNavbar from "../Navbar/InstructorNavbar";
import InstructorSidebar from "../Sidebar/InstructorSidebar";

export default function InstructorLayout() {
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <InstructorSidebar
      
    
      />

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
        <InstructorNavbar />

        {/* Content */}
        <main className="pt-14 p-6 bg-gray-50 min-h-screen md:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
