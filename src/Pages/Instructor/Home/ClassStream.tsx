import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import CourseHeader from "@/components/ClassStream/CourseHeader";
import SectionDropdown from "@/components/ClassStream/SectionDropdown";
import ActionButtons from "@/components/ClassStream/ActionButtons";
import PostCard from "@/components/ClassStream/PostCard";
import { GetClassPosts } from "@/Services/class Endpoints/Endpoints";
import { getToken } from "@/utilis/token";
import type { Post } from "@/Types/posts";

export default function ClassStream() {
  const location = useLocation();
  const { id } = useParams(); // id = classId

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const role: "admin" | "instructor" | "student" = location.pathname.startsWith(
    "/instructor",
  )
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
      const postsRes = await GetClassPosts(id, token);

      // assuming the backend returns both announcements + courseworks here
      const allPosts: Post[] = postsRes.data?.posts || [];

      // sort by newest
      allPosts.sort(
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
    if (!id) return;
    fetchPosts();
  }, [id]);
  if (!id) {
    return <div className="p-6 text-red-600">Missing class id</div>;
  }

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
              classId={id}
              key={p._id}
              post={p}
              role={role}
              hideActions={role === "student"}
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
