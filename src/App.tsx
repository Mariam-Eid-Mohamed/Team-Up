import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import AuthLayout from "./components/AuthLayout/AuthLayout";
import NotFound from "./Pages/NotFound/NotFound";
import Login from "./Pages/Auth/Login/Login";
import Register from "./Pages/Auth/Register/Register";
// import MasterLayout from "./components/MasterLayout/MasterLayout";
// import Home from "./Pages/Student/Home/Home";
// import StudentLayout from "./components/StudentLayout/StudentLayout";
import InstructorLayout from "./components/InstructorLayout/InstructorLayout";
import InstructorDashboard from "./Pages/Instructor/Home/Home";
// import StudentHome from "./Pages/Student/Home/Home";


function App() {
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
            // Add more instructor pages here
          ],
        },
      //  {
      //     path: "/student",
      //     element: <StudentLayout />,
      //     errorElement: <NotFound />,
      //     children: [
      //       { index: true, element: <StudentHome /> },
      //       { path: "home", element: <StudentHome /> },
      //       // Add more student pages here
      //     ],
      //   },
  ]);

  
  return (
    <>
      <RouterProvider router={routes}></RouterProvider>
    </>
  );
}

export default App;
