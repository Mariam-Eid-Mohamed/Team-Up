import { useState } from "react";
import { Edit2, Trash2, UploadCloud, X, Download, Info } from "lucide-react";

interface TaskDetailsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskDetailsSidebar({ isOpen, onClose }: TaskDetailsSidebarProps) {
  const [status, setStatus] = useState("In Progress");
  const [assignedTo, setAssignedTo] = useState("Nada Mohammed");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);
  const [hasUploadedFile, setHasUploadedFile] = useState(true);

  if (!isOpen) return null;

  const assignees = [
    { name: "Unassigned", isPlaceholder: true },
    { name: "Dalia Adel", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" },
    { name: "Helana Nemr", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces" },
    { name: "Nada Mohammed", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces" },
  ];

  return (
    <>
      {/* Dim Overlay Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-[999]" onClick={onClose} />

      {/* Sidebar Drawer Container */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-[500px] bg-white z-[1000] shadow-2xl flex flex-col font-sans border-l border-gray-100 animate-in slide-in-from-right duration-200">
        
        {/* Header Section with Inline Action Group */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Analysis</h2>
          
          {/* Aligned Control Group: Edit -> Delete -> Close */}
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-md transition-colors cursor-pointer">
              <Edit2 size={18} className="stroke-[2.5]" />
            </button>
            <div className="w-[1px] h-4 bg-gray-200 mx-0.5" />
            <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer">
              <Trash2 size={18} className="stroke-[2.5]" />
            </button>
            <div className="w-[1px] h-4 bg-gray-200 mx-0.5" />
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors cursor-pointer">
              <X size={20} className="stroke-[2.5]" />
            </button>
          </div>
        </div>

        <div className="px-8">
          <hr className="border-gray-200/70 w-full" />
        </div>

        {/* Scrollable Form Body Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          
          {/* Status Row */}
          <div className="flex items-center justify-between relative">
            <span className="text-gray-500 font-medium text-[15px]">Status</span>
            <div>
              <button
                onClick={() => {
                  setIsStatusDropdownOpen(!isStatusDropdownOpen);
                  setIsAssigneeDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200/60 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                <span>{status}</span>
                <span className="text-[9px]">▼</span>
              </button>

              {isStatusDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-32 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                  {["To Do", "In Progress", "Done"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setStatus(opt);
                        setIsStatusDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Deadline Row */}
          <div className="flex items-center justify-between text-[15px]">
            <span className="text-gray-500 font-medium">Deadline</span>
            <span className="text-gray-700 font-medium">25/6/2026</span>
          </div>

          {/* Contributors Group */}
          <div className="space-y-4 pt-2">
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">Contributors</h3>
            
            {/* Created By Row */}
            <div className="flex items-center justify-between text-[15px]">
              <span className="text-gray-500 font-medium">Created by</span>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
                  <span className="text-gray-400 text-xs">👤</span>
                </div>
                <span className="text-gray-800 font-medium">Nada Mohammed</span>
              </div>
            </div>

            {/* Assigned To Row */}
            <div className="flex items-center justify-between text-[15px] relative">
              <span className="text-gray-500 font-medium">Assigned to</span>
              <div>
                <button
                  onClick={() => {
                    setIsAssigneeDropdownOpen(!isAssigneeDropdownOpen);
                    setIsStatusDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50/80 transition-colors cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
                    <span className="text-gray-400 text-[10px]">👤</span>
                  </div>
                  <span className="text-gray-800 font-medium text-sm">{assignedTo}</span>
                  <span className="text-gray-400 text-[9px] ml-0.5">▼</span>
                </button>

                {isAssigneeDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1.5 overflow-hidden">
                    {assignees.map((user) => (
                      <button
                        key={user.name}
                        onClick={() => {
                          setAssignedTo(user.name);
                          setIsAssigneeDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                      >
                        {user.isPlaceholder ? (
                          <div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                            <span className="text-[10px] text-gray-400">👤</span>
                          </div>
                        ) : (
                          <img src={user.avatar} alt="" className="w-6 h-6 rounded-full object-cover border border-gray-100" />
                        )}
                        <span className="text-sm font-medium text-gray-700">{user.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description Block */}
          <div className="space-y-2 pt-2">
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">Description</h3>
            <p className="text-sm text-gray-700 leading-relaxed text-justify">
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Pretium tellus duis convallis tempus leo eu aenean. Iaculis massa nisl malesuada lacinia integer nunc posuere. Conubia nostra inceptos himenaeos orci varius natoque penatibus. Nulla molestie mattis scelerisque maximus eget fermentum odio. Blandit quis suspendisse aliquet nisi sodales consequat magna. Ligula congue sollicitudin erat viverra ac tincidunt nam. Velit aliquam imperdiet mollis nullam volutpat porttitor ullamcorper. Doi felis venenatis ultrices proin libero feugiat tristique. Cubilia curae hac habitasse platea dictumst lorem ipsum. Sem placerat in id cursus mi pretium tellus. Fringilla lacus nec metus bibendum egestas iaculis massa. Taciti sociosqu ad litora torquent per conubia nostra. Ridiculus mus donec rhoncus eros lobortis nulla molestie. Mauris pharetra vestibulum fusce dictum risus blandit quis. Finibus facilisis dapibus etiam interdum tortor ligula congue. Justo lectus commodo augue arcu dignissim velit aliquam. Primis vulputate ornare sagittis vehicula praesent dui felis. Senectus netus suscipit auctor curabitur facilisi cubilia curae. Quisque faucibus ex sapien vitae pellentesque sem placerat.
            </p>
          </div>

          {/* Deliverable Section */}
          <div className="space-y-3 pt-2 pb-8">
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">Deliverable</h3>

            {hasUploadedFile ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between border border-emerald-100/70 rounded-lg px-4 py-3 bg-emerald-50/20">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-gray-800">Final_Report.pdf</p>
                    <p className="text-xs text-gray-400">1.2 MB • Uploaded on 15 Jun 2026, 11:45 AM</p>
                  </div>
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 bg-white border border-gray-100 px-2.5 py-1.5 rounded-md shadow-xs transition-colors cursor-pointer">
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                </div>

                <div className="flex items-start gap-2.5 border border-sky-100 bg-sky-50/40 p-3 rounded-lg text-xs text-sky-700 leading-normal">
                  <Info size={15} className="mt-0.5 flex-shrink-0" />
                  <p>Only the assigned member can upload or replace the deliverable.</p>
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-xl p-5 bg-white flex flex-col items-center justify-center shadow-xs">
                <div className="flex flex-col items-center py-4 text-center">
                  <UploadCloud size={32} className="text-teal-600 stroke-[1.5] mb-2" />
                  <p className="text-xs font-semibold text-teal-600 hover:underline cursor-pointer">click to browse</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Accepted .pdf files only</p>
                </div>

                <div className="w-full border border-gray-100 rounded-lg p-3 bg-gray-50/50 flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-red-100 text-red-600 font-bold rounded-md flex items-center justify-center text-[9px] tracking-wider">PDF</div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Final_Report.pdf</p>
                      <p className="text-[10px] text-gray-400">1.2 MB</p>
                    </div>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 rounded-full transition-colors cursor-pointer">
                    <X size={14} />
                  </button>
                </div>

                <button className="w-full py-2.5 bg-[#2D7A78] hover:bg-[#235F5D] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer">
                  Upload Deliverable
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}