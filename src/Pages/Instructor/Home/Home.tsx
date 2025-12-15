// import { useState } from "react";
// import { Plus, Megaphone, UserPlus } from "lucide-react";
// import { ClassCard } from "../../../components/ClassCard/ClassCard";
// // import { CreateClassModal } from "../../../componentscomponents/CreateClassModal/CreateClassModal";
// // import { CreateAnnouncementModal } from "../CreateAnnouncementModal";
// // import { InviteStudentModal } from "./InviteStudentModal";

// import type { Class } from "../../../App";

// interface InstructorDashboardProps {
//   onSelectClass: (classData: Class) => void;
// }

// export function InstructorDashboard({
//   onSelectClass,
// }: InstructorDashboardProps) {
//   const [classes, setClasses] = useState<Class[]>([
//     {
//       id: "1",
//       name: "CS 101 - Introduction to Programming",
//       code: "CS101",
//       description: "Learn the fundamentals of programming using Python",
//       semester: "Fall 2025",
//       studentsCount: 45,
//       teamsCount: 9,
//       color: "bg-blue-500",
//     },
//     {
//       id: "2",
//       name: "CS 301 - Data Structures",
//       code: "CS301",
//       description: "Advanced data structures and algorithms",
//       semester: "Fall 2025",
//       studentsCount: 38,
//       teamsCount: 8,
//       color: "bg-purple-500",
//     },
//     {
//       id: "3",
//       name: "CS 401 - Software Engineering",
//       code: "CS401",
//       description: "Software development methodologies and practices",
//       semester: "Fall 2025",
//       studentsCount: 32,
//       teamsCount: 6,
//       color: "bg-green-500",
//     },
//   ]);

//     const [currentView, setCurrentView] = useState("classes");
//     const [showCreateClass, setShowCreateClass] = useState(false);
//     const [showAnnouncement, setShowAnnouncement] = useState(false);
//     const [showInvite, setShowInvite] = useState(false);

//     const handleCreateClass = (newClass: Omit<Class, "id">) => {
//       const classWithId: Class = {
//         ...newClass,
//         id: Date.now().toString(),
//       };
//       setClasses([...classes, classWithId]);
//       setShowCreateClass(false);
//     };

//   const renderContent = () => {

//         return (
//           <div className="space-y-6">
//             <div>
//               <h2 className="text-[#171717] mb-4">Dashboard Overview</h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="bg-white p-6 rounded-lg border border-[#E5E5E5]">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-[#9B87F5] bg-opacity-10 rounded-lg flex items-center justify-center">
//                       <span className="text-2xl text-[#9B87F5]">
//                         {classes.length}
//                       </span>
//                     </div>
//                     <div>
//                       <p className="text-sm text-[#A3A3A3]">Total Classes</p>
//                       <p className="text-[#171717]">Active Courses</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-white p-6 rounded-lg border border-[#E5E5E5]">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-[#7DD3FC] bg-opacity-10 rounded-lg flex items-center justify-center">
//                       <span className="text-2xl text-[#0F766E]">
//                         {classes.reduce((acc, c) => acc + c.studentsCount, 0)}
//                       </span>
//                     </div>
//                     <div>
//                       <p className="text-sm text-[#A3A3A3]">Total Students</p>
//                       <p className="text-[#171717]">Enrolled</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-white p-6 rounded-lg border border-[#E5E5E5]">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-[#10B981] bg-opacity-10 rounded-lg flex items-center justify-center">
//                       <span className="text-2xl text-[#10B981]">
//                         {classes.reduce((acc, c) => acc + c.teamsCount, 0)}
//                       </span>
//                     </div>
//                     <div>
//                       <p className="text-sm text-[#A3A3A3]">Total Teams</p>
//                       <p className="text-[#171717]">Formed</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <h3 className="text-[#171717] mb-4">Recent Classes</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {classes.slice(0, 3).map((classData) => (
//                   <ClassCard
//                     key={classData.id}
//                     classData={classData}
//                     onClick={() => onSelectClass(classData)}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         );

//             {classes.length === 0 && (
//               <div className="text-center py-12 bg-white rounded-lg border border-[#E5E5E5]">
//                 <p className="text-[#A3A3A3] mb-4">
//                   No classes yet. Create your first class to get started!
//                 </p>
//                 <button
//                   onClick={() => setShowCreateClass(true)}
//                   className="px-6 py-3 bg-[#9B87F5] text-white rounded-lg hover:bg-[#8B77E5] transition-colors"
//                 >
//                   Create Your First Class
//                 </button>
//               </div>
//             )}
//         ;

//     }
//   };
//     );
// }

// //   return (
// //     <div className="flex h-screen bg-[#FAFAFA]">
// //       {/* Content */}
// //       <main className="flex-1 overflow-y-auto">
// //         <div className="max-w-7xl mx-auto px-8 py-8">
// //           {/* Quick Action Buttons */}
// //           <div className="mb-6 flex gap-3 justify-end">
// //             <button
// //               onClick={() => setShowAnnouncement(true)}
// //               className="px-4 py-2 bg-[#7DD3FC] text-white rounded-lg hover:bg-[#38BDF8] transition-colors flex items-center gap-2"
// //             >
// //               <Megaphone className="w-4 h-4" />
// //               New Announcement
// //             </button>
// //             <button
// //               onClick={() => setShowInvite(true)}
// //               className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors flex items-center gap-2"
// //             >
// //               <UserPlus className="w-4 h-4" />
// //               Invite Students
// //             </button>
// //             <button
// //               onClick={() => setShowCreateClass(true)}
// //               className="px-4 py-2 bg-[#9B87F5] text-white rounded-lg hover:bg-[#8B77E5] transition-colors flex items-center gap-2"
// //             >
// //               <Plus className="w-4 h-4" />
// //               Create Class
// //             </button>
// //           </div>

// //           {renderContent()}
// //         </div>
// //       </main>
// //     </div>

//     //   {/* Modals */}
//     //   {showCreateClass && (
//     //     <CreateClassModal
//     //       onClose={() => setShowCreateClass(false)}
//     //       onCreate={handleCreateClass}
//     //     />
//     //   )}

//     //   {showAnnouncement && (
//     //     <CreateAnnouncementModal
//     //       onClose={() => setShowAnnouncement(false)}
//     //       classes={classes}
//     //     />
//     //   )}

//     //   {showInvite && (
//     //     <InviteStudentModal
//     //       onClose={() => setShowInvite(false)}
//     //       classes={classes}
//     //     />
//     //   )}
//     // </div>

import { useState } from "react";
import { Plus, Megaphone, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ClassCard } from "../../../components/ClassCard/ClassCard";
import type { Class } from "../../../App";

export function InstructorDashboard() {
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
      color: "bg-green-500",
    },
  ]);

  return (
    <div className="flex h-screen bg-[#FAFAFA]">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Buttons */}
          <div className="mb-6 flex gap-3 justify-end">
            <button className="px-4 py-2 bg-[#7DD3FC] text-white rounded-lg flex items-center gap-2">
              <Megaphone className="w-4 h-4" />
              New Announcement
            </button>

            <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Invite Students
            </button>

            <button className="px-4 py-2 bg-[#9B87F5] text-white rounded-lg flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Class
            </button>
          </div>

          {/* Classes */}
          <h2 className="text-[#171717] mb-4">My Classes</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {classes.map((classData) => (
              <ClassCard
                key={classData.id}
                classData={classData}
                onClick={() => navigate(`/instructor/classes/${classData.id}`)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
