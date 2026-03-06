import { Download, Link } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

export function StudentProfile() {
  // mock data
  const mockGPAandAvailability = {
    gpa: 2.33,
    availability: "Morning",
  };

  const mockSkills = {
    skills: ["Frontend", "Backend", "Prompt Eng", "Good communication", "SQL"],
    links: [
      {
        name: "GitHub",
        url: "https://github.com/eeaaAfchghfgvjjhjh",
      },
      {
        name: "LinkedIn",
        url: "https://linkedin.com",
      },
    ],
    cv: {
      fileName: "DaliaAdelMohamed.pdf",
      fileUrl: "/files/DaliaAdelMohamed.pdf",
    },
  };

  return (
    <>
      {/* Header */}
      <header className=" mx-auto px-5 sm:px-6 lg:px-8 ">
        <div className=" bg-white border-b rounded-lg  px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-8">
            {/* Profile Pic */}
            <div className="rounded-full aspect-square overflow-hidden w-42 h-42">
              <img
                src="https://dennymfg.com/cdn/shop/products/ckgrayHigh_600x.jpg?v=1619109728"
                alt="profile-pic"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Profile Info */}
            <div className="flex flex-1 flex-col gap-2 items-center sm:items-start w-full">
              <h1 className="text-3xl font-bold text-gray-800">Dalia Adel</h1>
              <p className="text-gray-500">20220516@stud.fci-cu.edu.eg</p>
              <p className="text-gray-500">daliaadel262</p>
              <p className="text-gray-500">Student</p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button className="w-full sm:w-auto px-4 py-3 bg-[#1F6B6B] text-white rounded-lg font-medium hover:bg-[#164e4e] transition-colors shadow-sm">
                  Message
                </button>
                <button className="w-full sm:w-auto px-4 py-3 bg-[#1F6B6B] text-white rounded-lg font-medium hover:bg-[#164e4e] transition-colors shadow-sm">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto px-5 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-4">
          {/* GPA + Availability + Skills */}
          <div className="flex flex-col gap-4">
            {/* GPA + Availability */}
            <div className="bg-white border-b rounded-lg px-4">
              <div className="flex flex-col">
                <div className="flex py-4 items-center flex-row justify-between">
                  <h2 className="text-2xl text-[#1F6B6B] text-center">GPA</h2>
                  <p className="text-base text-gray-500 text-center">
                    {mockGPAandAvailability.gpa}
                  </p>
                </div>

                <hr className="bg-gray-500" />

                <div className="flex py-4 items-center flex-row justify-between">
                  <h2 className="text-2xl text-[#1F6B6B] text-center">
                    Availability
                  </h2>
                  <p className="text-base text-gray-500 text-center truncate">
                    {mockGPAandAvailability.availability}
                  </p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className=" bg-white border-b rounded-lg px-4">
              <div className="flex flex-col">
                {/* Skills */}
                <div className="flex py-4 flex-col gap-4">
                  <h2 className="text-2xl text-[#1F6B6B]">Skills</h2>

                  <div className="flex flex-wrap gap-2">
                    {mockSkills.skills.length > 0 ? (
                      mockSkills.skills.map((skill, i) => (
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
                    {mockSkills.links.length > 0 ? (
                      mockSkills.links.map((link, i) => (
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
                        No skills added yet
                      </p>
                    )}
                  </div>
                </div>

                <hr className="bg-gray-500" />

                {/* CV */}
                <div className="flex py-4 flex-col gap-4">
                  <h2 className="text-2xl text-[#1F6B6B]">CV</h2>

                  <div className="flex justify-between items-center">
                    <p className="truncate w-full">{mockSkills.cv.fileName}</p>

                    <button className="bg-[#1F6B6B] text-white p-2 rounded-md">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ratings + Reviews */}
          <div className=" bg-white border-b rounded-lg p-4 lg:col-span-2">
            <div className="flex flex-col gap-4">
              <h2 className="flex-1 text-2xl text-[#1F6B6B]">Ratings</h2>
              <div className="flex-1 min-h-[400px] flex items-center justify-center text-gray-500">
                Student has no ratings yet
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
