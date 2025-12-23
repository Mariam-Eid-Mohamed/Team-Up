import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function SectionDropdown() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const role = location.pathname.startsWith("/instructor")
    ? "instructor"
    : "student";

  const handleChange = (value: string) => {
    if (value === "general") {
      navigate(`/${role}/classes/${id}`);
    } else {
      navigate(`/${role}/classes/${id}/sections/${value}`);
    }
  };

  return (
    <select
      onChange={(e) => handleChange(e.target.value)}
      className="w-full sm:w-auto px-4 py-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
      defaultValue="general"
    >
      <option value="general">General</option>
      <option value="1">Section 1</option>
      <option value="2">Section 2</option>
      <option value="3">Section 3</option>
    </select>
  );
}
