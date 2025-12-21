import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClassCard } from "../../../components/ClassCard/ClassCard";
import type { Class } from "../../../App";

export function StudentDashboard() {
  const navigate = useNavigate();
  const [classes] = useState<Class[]>([
    {
      id: "1",
      name: "CS 101 - Introduction to Programming",
      code: "CS101",
      description: "Learn the fundamentals of programming using Python",
      semester: "Fall 2025",
      studentsCount: 45,
      teamsCount: 9,
      instructorsCount: 1,
      color: "bg-blue-500",
    },
    {
      id: "2",
      name: "CS 301 - Data Structures",
      code: "CS301",
      description: "Advanced data structures and algorithms",
      semester: "Fall 2025",
      studentsCount: 38,
      teamsCount: 8,
      instructorsCount: 1,
      color: "bg-purple-500",
    },
    {
      id: "3",
      name: "CS 401 - Software Engineering",
      code: "CS401",
      description: "Software development methodologies and practices",
      semester: "Fall 2025",
      studentsCount: 32,
      teamsCount: 6,
       instructorsCount: 1,
      color: "bg-green-500",
    },
  ]);

  return (
    <div className="flex h-screen bg-[#FAFAFA]">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 my-3 sm:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {classes.map((classData) => (
              <ClassCard
                key={classData.id}
                classData={classData}
                onClick={() => navigate(`/student/classes/${classData.id}`)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
