import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import CourseHeader from "@/components/ClassStream/CourseHeader";
import SectionDropdown from "@/components/ClassStream/SectionDropdown";
import ActionButtons from "@/components/ClassStream/ActionButtons";
import PostCard from "@/components/ClassStream/PostCard";
import { GetClassPosts } from "@/Services/class Endpoints/Endpoints";
import { getClassAnnouncements } from "@/Services/announcement Endpoints/Endpoints";
import { getToken } from "@/utilis/token";
import type { Post } from "@/Types/posts";

export default function ClassStream() {
  const location = useLocation();
  const { id } = useParams(); // id = classId

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 const role: "admin" | "instructor" | "student" =
    location.pathname.startsWith("/instructor")
      ? "instructor"
      : location.pathname.startsWith("/student")
        ? "student"
        : "admin";

  const fetchPosts = async () => {
    if (!id) return;
    const token = getToken();
    if (!token) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Fetch announcements using the new API
      const announcementsRes = await getClassAnnouncements(id, token);
      const announcementsData = announcementsRes.data?.data || [];

      // Transform announcements to match Post type
      const transformedAnnouncements: Post[] = announcementsData.map(
        (announcement: any) => {
          // Get the instructor name directly from API response
          // API returns: authorId: { _id: "instructorId", name: "Dr. Ahmed" }
          const instructorName = announcement.authorId?.name || "";
          const instructorId = announcement.authorId?._id || "";

          // Split the name for the Author type structure
          // Use the full name from API response
          const nameParts = instructorName.trim().split(/\s+/);
          const first_name = nameParts[0] || "";
          const last_name = nameParts.slice(1).join(" ") || "";

          return {
            _id: announcement._id,
            type: "ANNOUNCEMENT" as const,
            classId: id!,
            authorId: {
              _id: instructorId,
              first_name: first_name,
              last_name: last_name,
              role: "Instructor" as const, // Announcements are instructor-only
            },
            announcement_text: announcement.announcement_text,
            createdAt: announcement.createdAt,
            updatedAt: announcement.createdAt, // API doesn't return updatedAt, use createdAt
          };
        },
      );

      // Fetch courseworks using the existing endpoint (if it returns courseworks)
      let courseworks: Post[] = [];
      try {
        const postsRes = await GetClassPosts(id, token);
        const allPosts = postsRes.data?.posts || [];
        // Filter only courseworks from the posts
        courseworks = allPosts.filter(
          (post: Post) => post.type === "COURSEWORK",
        );
      } catch (e) {
        // If GetClassPosts fails, just continue with announcements
        console.warn("Failed to fetch courseworks:", e);
      }

      // Combine and sort by createdAt (latest first)
      const allPosts = [...transformedAnnouncements, ...courseworks].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      setPosts(allPosts);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <CourseHeader />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
        <SectionDropdown />
        <ActionButtons role={role} classId={id!} onPostCreated={fetchPosts} />
      </div>

      <div className="mt-6 space-y-6">
        {loading && <div className="text-sm text-gray-600">Loading...</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}

        {!loading &&
          !error &&
          posts.map((p) => (
            <PostCard
              key={p._id}
              post={p}
              role={role}
               hideActions={role === "student"} // ✅ ADDED
              onChanged={fetchPosts} // بعد edit/delete refresh
            />
          ))}

        {!loading && !error && posts.length === 0 && (
          <div className="text-sm text-gray-600">No posts yet.</div>
        )}
      </div>
    </div>
  );
}
