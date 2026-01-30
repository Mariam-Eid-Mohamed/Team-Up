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

  const role: "student" | "instructor" = location.pathname.startsWith(
    "/instructor"
  )
    ? "instructor"
    : "student";

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
      const res = await GetClassPosts(id, token);

      // حسب شكل response اللي بعتيه: { success: true, posts: [...] }
      setPosts(res.data.posts || []);
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
