import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import AuthLayout from "./components/AuthLayout/AuthLayout";
import NotFound from "./Pages/NotFound/NotFound";
import Login from "./Pages/Auth/Login/Login";
import Register from "./Pages/Auth/Register/Register";
import StudentLayout from "./components/StudentLayout/StudentLayout";
import InstructorLayout from "./components/InstructorLayout/InstructorLayout";
import { InstructorDashboard } from "./Pages/Instructor/Home/Home";
import ClassDetailsPage from "./components/ClassDetailsPage/ClassDetailsPage";
import { StudentDashboard } from "./Pages/Student/Home/Home";
import ClassStream from "./Pages/Instructor/Home/ClassStream";
import SectionStream from "./Pages/Instructor/Home/SectionStream";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ClassMembers from "./Pages/Instructor/Home/ClassMembers";
import TeamWorkspace from "./Pages/Instructor/Home/TeamWorkspace";
import TeamsPage from "./Pages/Instructor/Home/TeamsPage";
import OwnTeams from "./Pages/Student/OwnTeams";
import InstructorOwnTeams from "./Pages/Instructor/Home/OwnTeams";
import { StudentProfile } from "./Pages/Student/Profile/StudentProfile";
import AvailableMembers from "./Pages/Instructor/Home/AvailableMembers";
import ForgetPassword from "./Pages/Auth/ForgetPassword/ForgetPassword";
import VerifyOtp from "./Pages/Auth/VerifyOtp/VerifyOtp";
import ResetPassword from "./Pages/Auth/ResetPassword/ResetPassword";
import ProtectedRoute from "@/components/ProtectedRoutes/ProtectedRoutes";
import PublicRoute from "@/components/PublicRoutes/PublicRoutes";

export default function App() {
  const routes = createBrowserRouter([
    {
      element: <PublicRoute />,
      children: [
        {
          path: "/",
          element: <AuthLayout />,
          errorElement: <NotFound />,
          children: [
            {
              index: true,
              element: <Login />,
            },
            {
              path: "login",
              element: <Login />,
            },
            {
              path: "register",
              element: <Register />,
            },
            {
              path: "forget-password",
              element: <ForgetPassword />,
            },
            {
              path: "verify-otp",
              element: <VerifyOtp />,
            },
            {
              path: "reset-password",
              element: <ResetPassword />,
            },
          ],
        },
      ],
    },

    {
      element: <ProtectedRoute allowedRole="Instructor" />,
      children: [
        {
          path: "/instructor",
          element: <InstructorLayout />,
          errorElement: <NotFound />,
          children: [
            { index: true, element: <InstructorDashboard /> },
            { path: "dashboard", element: <InstructorDashboard /> },
            { path: "classes/:id", element: <ClassStream /> },
            { path: "classes/:id/details", element: <ClassDetailsPage /> },
            {
              path: "classes/:id/sections/:sectionId",
              element: <SectionStream />,
            },
            { path: "classes/:id/members", element: <ClassMembers /> },
            { path: "teams", element: <InstructorOwnTeams /> },
            { path: "teams/:teamId", element: <TeamWorkspace /> },
          ],
        },
      ],
    },

    {
      element: <ProtectedRoute allowedRole="Student" />,
      children: [
        {
          path: "/student",
          element: <StudentLayout />,
          errorElement: <NotFound />,
          children: [
            { index: true, element: <StudentDashboard /> },
            { path: "dashboard", element: <StudentDashboard /> },
            { path: "classes/:id", element: <ClassStream /> },
            { path: "classes/:id/details", element: <ClassDetailsPage /> },
            {
              path: "classes/:id/sections/:sectionId",
              element: <SectionStream />,
            },
            { path: "classes/:id/members", element: <ClassMembers /> },
            {
              path: "classes/:id/available-members",
              element: <AvailableMembers />,
            },
            { path: "teams/:teamId", element: <TeamWorkspace /> },
            { path: "teams", element: <OwnTeams /> },
            {
              path: "classes/:id/coursework/:courseworkId/teams",
              element: <TeamsPage />,
            },
            {
              path: ":id/profile",
              element: <StudentProfile />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <GoogleOAuthProvider clientId="996803786434-eb4r231uhc5d9t8krd5baoa8vefpm6p6.apps.googleusercontent.com">
      <Toaster position="top-right" />
      <RouterProvider router={routes} />
    </GoogleOAuthProvider>
  );
}
