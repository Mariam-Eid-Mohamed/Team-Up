import { Pencil, Trash, Download } from "lucide-react";
import AnnouncementModal from "./AnnouncemetModal";
import { useState } from "react";
interface PostCardProps {
  withFile?: boolean;
}



export default function PostCard({ withFile }: PostCardProps) {
  const [modalMode, setModalMode] = useState<"edit" | "delete" | null>(null);
  const postContent = "There will be a quiz next saturday";
  return (
    <div className="bg-white rounded-lg shadow p-5">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300" />
          <div>
            <p className="font-semibold text-sm">Nourhan Ihab</p>
            <p className="text-xs text-gray-500">21/12/2025 - 8:00 AM</p>
          </div>
        </div>
       

       <div className="flex gap-2 text-gray-500">
          <Pencil 
            size={16} 
            className="cursor-pointer hover:text-black" 
            onClick={() => setModalMode("edit")}
          />
          <Trash 
            size={16} 
            className="cursor-pointer hover:text-red-600" 
            onClick={() => setModalMode("delete")}
          />
        </div>
        
      </div>

      <hr className="border-t border-gray-300 mt-4" />

      {/* Content */}
      <div className="mt-4 space-y-2 text-sm">
        <h3 className="font-semibold">SOA Phase 1</h3>
        <p>Phase 1 for SOA project. Please view file for project description.</p>

        <p><strong>Team size:</strong> 3 - 5</p>
        <p><strong>Grade:</strong> 10</p>
        <p><strong>Deadline:</strong> 21/12/2025</p>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sint, maxime? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam ipsam nostrum tempore nulla perferendis? Quia iusto eos, nemo perferendis, ipsum perspiciatis, quibusdam eius ex reprehenderit deleniti aperiam maiores eveniet cupiditate.</p>

        {withFile && (
          <div className="mt-4 flex items-center gap-3 border rounded-md p-3 w-fit">
            <div className="w-8 h-8 bg-gray-200 rounded" />
            <div>
              <p className="text-xs font-medium">File Name</p>
              <p className="text-xs text-gray-500">PDF / ZIP / PNG</p>
            </div>
            <Download size={16} className="ml-2 cursor-pointer" />
          </div>
        )}
      </div>

      <AnnouncementModal 
        isOpen={!!modalMode}
        onClose={() => setModalMode(null)}
        mode={modalMode || "edit"}
        initialData={postContent}
        onConfirm={(data) => {
          if (modalMode === "edit") console.log("Update logic here", data);
          if (modalMode === "delete") console.log("Delete logic here");
        }}
      />
    </div>
  );
}
