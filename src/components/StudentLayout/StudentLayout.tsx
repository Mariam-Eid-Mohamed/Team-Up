import { Outlet } from "react-router-dom";
import InstructorSidebar from "../Sidebar/InstructorSidebar";
import AppNavbar from "../Navbar/AppNavbar";

export default function StudentLayout() {
  // const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <AppNavbar />

        {/* Content */}
        <main className="pt-14 bg-gray-50 min-h-screen ml-16 lg:ml-64 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
