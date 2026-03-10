import { Download, Link, Loader2 } from "lucide-react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStudentProfile } from "../../../Services/profile Endpoints/Endpoints";
import { type StudentProfileData } from "../../../interfaces/ProfileInterfaces/profileInterface";
import profilePlaceholder from "../../../assets/images/profile-placeholder.png";
import { useSessionStore } from "@/store/sessionStore";

export function StudentProfile() {
  const { id } = useParams<{ id: string }>();

  const token = useSessionStore((state) => state.token);
  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getStudentProfile(id!, token!);
        setProfile(response.data.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.message ?? "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    if (id && token) fetchProfile();
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2D7A78]" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error ?? "Profile not found."}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden pt-6">
      {/* Header */}
      <header className="px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm border border-gray-100 rounded-lg px-4 sm:px-6 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-5">
            {/* Profile Pic */}
            <div className="rounded-full overflow-hidden w-30 h-30 sm:w-40 sm:h-40 flex-shrink-0">
              <img
                src={profile.profile_picture?.storagePath ?? profilePlaceholder}
                alt="profile-pic"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Profile Info */}
            <div className="flex flex-1 flex-col gap-2 items-center sm:items-start min-w-0 w-full">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 truncate w-full text-center sm:text-left">
                {profile.fullName}
              </h1>
              <p className="text-gray-500 text-sm truncate w-full text-center sm:text-left">
                {profile.email}
              </p>
              <p className="text-gray-500 text-sm text-center sm:text-left">
                {profile.username}
              </p>
              <p className="text-gray-500 text-sm text-center sm:text-left">
                Student
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-1">
                <button className="w-full sm:w-auto px-4 py-2 bg-[#1F6B6B] text-sm text-white rounded-lg font-medium hover:bg-[#164e4e] transition-colors shadow-sm cursor-pointer">
                  Message
                </button>
                {profile.user_id === localStorage.getItem("user_id") && (
                  <button className="w-full sm:w-auto px-4 py-2 border text-[#1F6B6B] border-[#1F6B6B] rounded-lg cursor-pointer hover:bg-[#1F6B6B] hover:text-white transition-colors text-sm">
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* GPA + Availability + Skills */}
          <div className="flex flex-col gap-4 min-w-0">
            {/* GPA + Availability */}
            <div className="bg-white shadow-sm border border-gray-100 rounded-lg px-4">
              <div className="flex flex-col">
                <div className="flex py-4 items-center flex-row justify-between gap-4">
                  <h2 className="text-xl text-[#1F6B6B] flex-shrink-0">GPA</h2>
                  <p className="text-sm text-gray-500 text-right truncate">
                    {profile.gpa ?? "N/A"}
                  </p>
                </div>

                <hr className="bg-gray-500" />

                <div className="flex py-4 items-center flex-row justify-between gap-4">
                  <h2 className="text-xl text-[#1F6B6B] flex-shrink-0">
                    Availability
                  </h2>
                  <p className="text-sm text-gray-500 text-right truncate">
                    {profile.availability.length > 0
                      ? profile.availability.join(", ")
                      : "Not set"}
                  </p>
                </div>
              </div>
            </div>

            {/* Skills + Links + CV */}
            <div className="bg-white shadow-sm border border-gray-100 rounded-lg px-4 min-w-0">
              <div className="flex flex-col">
                {/* Skills */}
                <div className="flex py-4 flex-col gap-4">
                  <h2 className="text-xl text-[#1F6B6B]">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.length > 0 ? (
                      profile.skills.map((skill, i) => (
                        <p
                          key={i}
                          className="text-sm text-white bg-[#9B87F5] px-3 py-1.5 rounded-md"
                        >
                          {skill}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No skills added yet
                      </p>
                    )}
                  </div>
                </div>

                <hr className="bg-gray-500" />

                {/* Links */}
                <div className="flex py-4 flex-col gap-4">
                  <h2 className="text-xl text-[#1F6B6B]">Links</h2>
                  <div className="flex flex-col gap-2 min-w-0">
                    {profile.links.length > 0 ? (
                      profile.links.map((link, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 min-w-0"
                        >
                          <Link size={16} className="flex-shrink-0" />
                          <h4 className="text-sm flex-shrink-0">{link.name}</h4>
                          <RouterLink
                            to={link.url}
                            target="_blank"
                            className="text-sm text-gray-500 truncate hover:underline min-w-0"
                          >
                            {link.url}
                          </RouterLink>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No links added yet
                      </p>
                    )}
                  </div>
                </div>

                <hr className="bg-gray-500" />

                {/* CV */}
                <div className="flex py-4 flex-col gap-4">
                  <h2 className="text-xl text-[#1F6B6B]">CV</h2>
                  {profile.cv.filename ? (
                    <div className="flex justify-between items-center gap-2 min-w-0">
                      <p className="truncate text-sm min-w-0">
                        {profile.cv.filename}
                      </p>

                      <a
                        href={`http://localhost:5001/${profile.cv.storagePath}`}
                        download={profile.cv.filename}
                        className="bg-[#1F6B6B] text-white p-2 rounded-md flex-shrink-0 hover:bg-[#164e4e] transition-colors"
                      >
                        <Download size={18} />
                      </a>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No CV uploaded yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ratings */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-4 lg:col-span-2 min-w-0">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl text-[#1F6B6B]">Ratings</h2>
              {profile.ratings.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {profile.ratings.map((rating, i) => (
                    <div
                      key={i}
                      className="border rounded-lg p-4 flex flex-col gap-2"
                    >
                      <div className="flex justify-between items-center gap-2">
                        <p className="font-medium text-gray-800 truncate">
                          {rating.raterName}
                        </p>
                        <p className="text-sm text-gray-400 flex-shrink-0">
                          {"★".repeat(rating.stars)}
                          {"☆".repeat(5 - rating.stars)}
                        </p>
                      </div>
                      {rating.comment && (
                        <p className="text-gray-500 text-sm">
                          {rating.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="min-h-[400px] flex items-center justify-center text-gray-500">
                  Student has no ratings yet
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
