import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ClassDetails } from "../ClassDetails/ClassDetails";
import type { Class } from "../../App";

const classes: Class[] = [
  {
    id: "1",
    name: "Web Programming",
    code: "CS101",
    description: "Intro to web",
    semester: "Fall 2025",
    color: "bg-blue-500",
    studentsCount: 30,
    teamsCount: 6,
    instructorsCount: 1,
  },
];

export default function ClassDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const classData = classes.find((c) => c.id === id);

  if (!classData) return <p className="p-6">Class not found</p>;

  const role: "student" | "instructor" =
    location.pathname.startsWith("/instructor") ? "instructor" : "student";

  return (
    <ClassDetails
      classData={classData}
      role={role}
      onBack={() => navigate(-1)}
      onUpdate={(updatedClass) => console.log("Updated:", updatedClass)}
      onDelete={() => {
        console.log("Deleted:", classData.id);
        navigate(role === "instructor" ? "/instructor/dashboard" : "/student/dashboard");
      }}
    />
  );
}
