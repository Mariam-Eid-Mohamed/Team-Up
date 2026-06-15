import { Download, Link, Loader2 } from "lucide-react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import profilePlaceholder from "../../../assets/images/profile-placeholder.png";
import { useSessionStore } from "@/store/sessionStore";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import EditProfileModal from "@/components/EditProfileModal/editProfileModal";
import { getStudentProfile } from "@/Services/profile Endpoints/Endpoints";
import { useProfileStore } from "@/store/ProfileStore/userProfileStore";
import { skillMap } from "@/data/skills";
import { availabilityMap } from "@/data/availability";
import { formatSkill } from "@/utilis/formatSkill";
import type { StudentProfileData } from "@/interfaces/ProfileInterfaces/profileInterface";

export function StudentProfile() {
  const { id } = useParams<{ id: string }>();
  const { token, userId } = useSessionStore((state) => state);
  const { profile, isLoading, error } = useProfileStore();

  const [visitedProfile, setVisitedProfile] = useState<StudentProfileData | null>(null);
  const [visitedLoading, setVisitedLoading] = useState(false);
  const [visitedError, setVisitedError] = useState<string | null>(null);

  const isOwnProfile = id === userId;
  const displayProfile = isOwnProfile ? profile : visitedProfile;
  const displayLoading = isOwnProfile ? isLoading : visitedLoading;
  const displayError = isOwnProfile ? error : visitedError;

  useEffect(() => {
    if (!id || !token) return;

    if (isOwnProfile) {
      useProfileStore.getState().fetchProfile(id, token);
    } else {
      setVisitedProfile(null);
      setVisitedLoading(true);
      setVisitedError(null);
      getStudentProfile(id, token)
        .then((res) => setVisitedProfile(res.data.data))
        .catch((err) => setVisitedError(err?.response?.data?.message ?? "Failed to load profile."))
        .finally(() => setVisitedLoading(false));
    }
  }, [id, token, isOwnProfile]);

  return (
    <>
      {displayLoading && (
        <div className="w-full overflow-x-hidden pt-6 min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="animate-spin" size={24} />
            <p className="text-gray-500">Loading profile...</p>
          </div>
        </div>
      )}

      {displayError && (
        <div className="w-full h-[400px] flex items-center justify-center absolute top-0 left-0 bg-white bg-opacity-75 z-10">
          <p className="text-red-500">{displayError}</p>
        </div>
      )}

      {displayProfile && (
        <div className="w-full overflow-x-hidden pt-6">
          {/* Header */}
          <header className="px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-sm border border-gray-100 rounded-lg px-4 sm:px-6 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-5">
                {/* Profile Pic */}
                <div className="rounded-full overflow-hidden w-30 h-30 sm:w-40 sm:h-40 shrink-0">
                  <img
                    src={
                      displayProfile.profile_picture?.storagePath ?? profilePlaceholder
                    }
                    alt="profile-pic"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Profile Info */}
                <div className="flex flex-1 flex-col gap-2 items-center sm:items-start min-w-0 w-full">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 truncate w-full text-center sm:text-left">
                    {displayProfile.fullName}
                  </h1>
                  <p className="text-gray-500 text-sm truncate w-full text-center sm:text-left">
                    {displayProfile.email}
                  </p>
                  <p className="text-gray-500 text-sm text-center sm:text-left">
                    {displayProfile.username}
                  </p>
                  <p className="text-gray-500 text-sm text-center sm:text-left">
                    Student
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-1">
                    {isOwnProfile && (
                      <Dialog>
                        <DialogTrigger className="w-full sm:w-auto px-4 py-2 border bg-primary  text-white hover:bg-primary-dark rounded-lg cursor-pointer shadow-sm  transition-colors text-sm">
                          Edit Profile
                        </DialogTrigger>
                        <DialogContent>
                          <EditProfileModal userId={id} token={token!} />
                        </DialogContent>
                      </Dialog>
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
                      <h2 className="text-xl text-[#1F6B6B] shrink-0">GPA</h2>
                      <p className="text-sm text-gray-500 text-right truncate">
                        {displayProfile?.gpa ?? "Not Set"}
                      </p>
                    </div>

                    <hr className="bg-gray-500" />

                    <div className="flex py-4 items-center flex-row justify-between gap-4">
                      <h2 className="text-xl text-[#1F6B6B] shrink-0">
                        Availability
                      </h2>
                      <p className="text-sm text-gray-500 text-right truncate">
                        {displayProfile?.availability
                          ? availabilityMap[displayProfile.availability] ||
                            displayProfile.availability
                          : "Not set"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skills + Links + CV */}
                <div className="bg-white shadow-sm border border-gray-100 rounded-lg px-4 min-w-0 h-full">
                  <div className="flex flex-col">
                    {/* Skills */}
                    <div className="flex py-4 flex-col gap-4">
                      <h2 className="text-xl text-[#1F6B6B]">Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        {(displayProfile?.skills ?? []).length > 0 ? (
                          displayProfile?.skills.map((skill, i) => (
                            <p
                              key={i}
                              className="text-sm text-white bg-[#8c80d9] px-3 py-1.5 rounded-md"
                            >
                              {skillMap[skill] ?? formatSkill(skill)}
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
                        {(displayProfile?.links ?? []).length > 0 ? (
                          displayProfile?.links.map((link, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 min-w-0"
                            >
                              <Link size={16} className="shrink-0" />
                              <h4 className="text-sm shrink-0">{link.name}</h4>
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
                      {displayProfile?.cv?.filename ? (
                        <div className="flex justify-between items-center gap-2 min-w-0">
                          <p className="truncate text-sm min-w-0">
                            {displayProfile.cv.filename}
                          </p>

                          <a
                            href={displayProfile.cv.storagePath || "#"}
                            className="bg-primary text-white p-2 rounded-md shrink-0 hover:bg-primary-dark transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download size={18} />
                          </a>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No CV uploaded yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ratings */}
              <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-4 lg:col-span-2 min-w-0">
                <div className="flex flex-col gap-4 h-full">
                  <h2 className="text-xl text-[#1F6B6B]">Ratings</h2>
                  {(displayProfile?.ratings ?? []).length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {displayProfile?.ratings.map((rating, i) => (
                        <div
                          key={i}
                          className="border rounded-lg p-4 flex flex-col gap-2"
                        >
                          <div className="flex justify-between items-center gap-2">
                            <p className="font-medium text-gray-800 truncate">
                              {rating.raterName}
                            </p>
                            <p className="text-sm text-gray-400 shrink-0">
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
      )}
    </>
  );
}
