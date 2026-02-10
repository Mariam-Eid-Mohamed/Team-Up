import { getUserClasses } from "@/Services/class Endpoints/Endpoints";

export async function fetchUserClassesMapped(userId: string, token: string) {
  const response = await getUserClasses(userId, token);

  const mapped = (response.data.data || []).map((classItem: any) => ({
    id: classItem._id,
    name: classItem.course_name || "",
    code: classItem.course_code || "",
    description: classItem.course_plan || "",
    year: classItem.year?.toString() || "",
    studentsCount: classItem.studentsCount || 0,
    teamsCount: classItem.teamsCount || 0,
    instructorsCount: classItem.instructorsCount || 1,
    color: classItem.class_color || "bg-blue-500",
  }));

  return mapped;
}
