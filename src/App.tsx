import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import AuthLayout from "./components/AuthLayout/AuthLayout";
import NotFound from "./Pages/NotFound/NotFound";
import Login from "./Pages/Auth/Login/Login";
import Register from "./Pages/Auth/Register/Register";
// import MasterLayout from "./components/MasterLayout/MasterLayout";
// import Home from "./Pages/Student/Home/Home";
import StudentLayout from "./components/StudentLayout/StudentLayout";
import InstructorLayout from "./components/InstructorLayout/InstructorLayout";
import { InstructorDashboard } from "./Pages/Instructor/Home/Home";
import ClassDetailsPage from "./components/ClassDetailsPage/ClassDetailsPage";
import {StudentDashboard} from "./Pages/Student/Home/Home";
import {GoogleOAuthProvider} from '@react-oauth/google'

export interface Class {
  id: string;
  name: string;
  code: string;
  description: string;
  semester: string;
  studentsCount: number;
  teamsCount: number;
  instructorsCount:number;
  color: string;
  // role:string;
}

export default function App() {
  const routes = createBrowserRouter([
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

        // {
        //   path: "reset-Password",
        //   element: <ResetPassword />,
        // },
        // {
        //   path: "change-Password",
        //   element: <ChangePassword />,
        // },
        // {
        //   path: "forget-Password",
        //   element: <ForgetPassword />,
        // },
      ],
    },
    // {
    //   path: "home",
    //   element: <MasterLayout />,
    //   errorElement: <NotFound />,
    //   children: [
    //     {
    //       index: true,
    //       element: <Home />,
    //     },
    //     {
    //       path: "home",
    //       element: <Home />,
    //     },
    //     //THIS IS AN EXAMPLE OF NESTED ROUTING , WE MAY USE IT LATER INSHALLAH
    //     // {
    //     //   path: "books",
    //     //   children: [
    //     //     { index: true, element: <Books /> },
    //     //     // {path:":bookId",element:<Book/>}
    //     //   ],
    //     // },
    //   ],
    // },
    // Role-based layouts
    {
      path: "/instructor",
      element: <InstructorLayout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <InstructorDashboard /> },
        { path: "dashboard", element: <InstructorDashboard /> },
        { path: "classes/:id", element: <ClassDetailsPage/>},
        // Add more instructor pages here
      ],
    },
     {
        path: "/student",
        element: <StudentLayout />,
        errorElement: <NotFound />,
        children: [
          { index: true, element: <StudentDashboard /> },
          { path: "dashboard", element: <StudentDashboard /> },
          { path: "classes/:id", element: <ClassDetailsPage /> },
          // Add more student pages here
        ],
      },
  ]);
  return (
    <>
    <GoogleOAuthProvider clientId="996803786434-eb4r231uhc5d9t8krd5baoa8vefpm6p6.apps.googleusercontent.com">
    <RouterProvider router={routes}></RouterProvider>
    </GoogleOAuthProvider>
      
    </>
  );
}
