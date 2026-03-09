import { Download, Link } from "lucide-react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStudentProfile } from "../../../Services/profile Endpoints/Endpoints"; 
import { type StudentProfileData } from "../../../interfaces/ProfileInterfaces/profileInterface"; 

export function StudentProfile() {
  const { id } = useParams<{ id: string }>();

  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("auth_token") ?? "";
        const response = await getStudentProfile(id!, token);
        setProfile(response.data.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.message ?? "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading profile...
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
    <>
      {/* Header */}
      <header className="mx-auto px-5 sm:px-6 lg:px-8">
        <div className="bg-white border-b rounded-lg px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-8">
            {/* Profile Pic */}
            <div className="rounded-full aspect-square overflow-hidden w-42 h-42">
              <img
                src={
                  profile.profile_picture.storagePath
                    ? `${profile.profile_picture.storagePath}`
                    : "https://dennymfg.com/cdn/shop/products/ckgrayHigh_600x.jpg?v=1619109728"
                }
                alt="profile-pic"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Profile Info */}
            <div className="flex flex-1 flex-col gap-2 items-center sm:items-start w-full">
              <h1 className="text-3xl font-bold text-gray-800">
                {profile.fullName}
              </h1>
              <p className="text-gray-500 text-center">{profile.email}</p>
              <p className="text-gray-500 text-center">{profile.username}</p>
              <p className="text-gray-500 text-center">Student</p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button className="w-full sm:w-auto px-4 py-3 bg-[#1F6B6B] text-white rounded-lg font-medium hover:bg-[#164e4e] transition-colors shadow-sm">
                  Message
                </button>
                {
                  profile.user_id === localStorage.getItem("user_id") && (
                    <button className="w-full sm:w-auto px-4 py-3 bg-[#1F6B6B] text-white rounded-lg font-medium hover:bg-[#164e4e] transition-colors shadow-sm">
                      Edit Profile
                    </button>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto px-5 sm:px-6 lg:px-8 py-4 sm:py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-4">
          {/* GPA + Availability + Skills */}
          <div className="flex flex-col gap-4">
            {/* GPA + Availability */}
            <div className="bg-white border-b rounded-lg px-4">
              <div className="flex flex-col">
                <div className="flex py-4 items-center flex-row justify-between">
                  <h2 className="text-2xl text-[#1F6B6B] text-center">GPA</h2>
                  <p className="text-base text-gray-500 text-center">
                    {profile.gpa ?? "N/A"}
                  </p>
                </div>

                <hr className="bg-gray-500" />

                <div className="flex py-4 items-center flex-row justify-between">
                  <h2 className="text-2xl text-[#1F6B6B] text-center">
                    Availability
                  </h2>
                  <p className="text-base text-gray-500 text-center truncate">
                    {profile.availability.length > 0
                      ? profile.availability.join(", ")
                      : "Not set"}
                  </p>
                </div>
              </div>
            </div>

            {/* Skills + Links + CV */}
            <div className="bg-white border-b rounded-lg px-4">
              <div className="flex flex-col">
                {/* Skills */}
                <div className="flex py-4 flex-col gap-4">
                  <h2 className="text-2xl text-[#1F6B6B]">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.length > 0 ? (
                      profile.skills.map((skill, i) => (
                        <p
                          key={i}
                          className="text-base text-white bg-[#9B87F5] p-2 rounded-md"
                        >
                          {skill}
                        </p>
                      ))
                    ) : (
                      <p className="text-base text-gray-500">
                        No skills added yet
                      </p>
                    )}
                  </div>
                </div>

                <hr className="bg-gray-500" />

                {/* Links */}
                <div className="flex py-4 flex-col gap-4">
                  <h2 className="text-2xl text-[#1F6B6B]">Links</h2>
                  <div className="flex flex-col gap-2">
                    {profile.links.length > 0 ? (
                      profile.links.map((link, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Link size={18} />
                            <h4 className="text-base">{link.name}</h4>
                          </div>
                          <RouterLink
                            to={link.url}
                            target="_blank"
                            className="text-base text-gray-500 truncate w-full hover:underline"
                          >
                            {link.url}
                          </RouterLink>
                        </div>
                      ))
                    ) : (
                      <p className="text-base text-gray-500">
                        No links added yet
                      </p>
                    )}
                  </div>
                </div>

                <hr className="bg-gray-500" />

                {/* CV */}
                <div className="flex py-4 flex-col gap-4">
                  <h2 className="text-2xl text-[#1F6B6B]">CV</h2>
                  {profile.cv.filename ? (
                    <div className="flex justify-between items-center">
                      <p className="truncate w-full">{profile.cv.filename}</p>
                      
                      <a  href={`http://localhost:5001/${profile.cv.storagePath}`}
                        download={profile.cv.filename}
                        className="bg-[#1F6B6B] text-white p-2 rounded-md"
                      >
                        <Download size={18} />
                      </a>
                    </div>
                  ) : (
                    <p className="text-base text-gray-500">No CV uploaded yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ratings */}
          <div className="bg-white border-b rounded-lg p-4 lg:col-span-2">
            <div className="flex flex-col gap-4">
              <h2 className="flex-1 text-2xl text-[#1F6B6B]">Ratings</h2>
              {profile.ratings.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {profile.ratings.map((rating, i) => (
                    <div key={i} className="border rounded-lg p-4 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-gray-800">{rating.raterName}</p>
                        <p className="text-sm text-gray-400">
                          {"★".repeat(rating.stars)}{"☆".repeat(5 - rating.stars)}
                        </p>
                      </div>
                      {rating.comment && (
                        <p className="text-gray-500 text-sm">{rating.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 min-h-[400px] flex items-center justify-center text-gray-500">
                  Student has no ratings yet
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}