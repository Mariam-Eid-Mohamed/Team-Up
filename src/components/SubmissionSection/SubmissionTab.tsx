import { useState } from "react";
import { Upload, FileText, Download,X, Loader2, UploadCloud } from "lucide-react";

interface SubmissionTabProps {
  teamData: any;
  isInstructor: boolean;
  onUpload: (file: File) => Promise<void>;
  onDownload: () => void;
}

export default function SubmissionTab({ teamData, isInstructor, onUpload, onDownload }: SubmissionTabProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadClick = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    await onUpload(selectedFile);
    setIsUploading(false);
    setSelectedFile(null);
  };

// Instructor View: Updated to handle the "No submission" state
if (isInstructor) {
  return (
    <div className="border-2 border border-teal-100 rounded-2xl p-12 bg-white flex flex-col items-center justify-center min-h-[400px]">
      {teamData.submission ? (
        <>
          {/* File Icon */}
          <FileText size={48} className="text-teal-200 mb-4" strokeWidth={1} />
          
          {/* File Details */}
          <p className="text-gray-400 text-sm mb-1">{teamData.submission.size || "1.2 MB"}</p>
          <p className="font-semibold text-gray-700 mb-8">{teamData.submission.fileName || "Final_Report.pdf"}</p>
          
          {/* Download Button */}
          <button 
            onClick={onDownload}
            className="w-full max-w-[240px] py-2.5 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors font-medium"
          >
            Download
          </button>
        </>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center text-center">
          <div className="bg-teal-50 p-4 rounded-full mb-4">
            <FileText size={32} className="text-teal-200" />
          </div>
          <p className="text-gray-500 font-medium">No submission yet</p>
          <p className="text-gray-400 text-sm mt-1">
            The team has not uploaded any files for this project.
          </p>
        </div>
      )}
    </div>
  );
}

  // --- STUDENT VIEW ---
  
  // 1. Initial Empty State
  if (!teamData.submission && !selectedFile) {
    return (
      <label className="border-2 border-dashed border-teal-200 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-teal-50/50 transition-all bg-white min-h-[400px]">
        <UploadCloud size={48} className="text-[#2D7A78] mb-4" />
        <p className="text-[#2D7A78] font-medium hover:underline">click to browse</p>
        <p className="text-xs text-gray-400 mt-2 bg-teal-100 px-3 py-1 rounded-full">PDF/ ZIP/ PNG - Max 20 MB</p>
        <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.zip,.png" />
      </label>
    );
  }

// 2. Pending Submission (File selected, waiting for Submit)
  if (selectedFile) {
    return (
      <div className="border-2 border-dashed border-teal-200 rounded-2xl p-12 flex flex-col items-center justify-center bg-white min-h-[400px]">
        <UploadCloud size={48} className="text-[#2D7A78] mb-4" />
        <p className="text-[#2D7A78] font-medium hover:underline">click to browse</p>
        <div className="text-xs text-[#2D7A78] bg-teal-50 px-3 py-1 rounded-full mb-6">
          PDF/ ZIP/ PNG - Max 25 MB
        </div>
        {/* File Preview Box */}
        <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-3 w-full max-w-sm mb-8 shadow-sm">
          <FileText size={24} className="text-gray-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            <p className="font-medium text-gray-700 truncate">{selectedFile.name}</p>
          </div>
          <button 
            onClick={() => setSelectedFile(null)} 
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Submit Button */}
        <button 
          onClick={handleUploadClick}
          disabled={isUploading}
          className="w-full max-w-sm py-2.5 bg-[#2D7A78] text-white rounded-lg hover:bg-[#23615f] transition-colors font-medium flex items-center justify-center gap-2"
        >
          {isUploading ? <Loader2 className="animate-spin" /> : "Submit"}
        </button>
      </div>
    );
  }
// 3. Submitted State 
  return (
    <div className="border border-teal-100 rounded-2xl p-12 bg-white flex flex-col items-center justify-center min-h-[400px]">
      {/* File Icon */}
      <FileText size={48} className="text-teal-200 mb-4" strokeWidth={1} />
      
      {/* File Details */}
      <p className="text-gray-400 text-sm mb-1">{teamData.submission.size}</p>
      <p className="font-semibold text-gray-700 mb-8">{teamData.submission.fileName}</p>
      
      <div className="flex flex-col gap-3 w-full max-w-[240px]">
        <button 
          className="w-full py-2.5 border border-teal-600 text-teal-700 rounded-lg hover:bg-teal-50 transition-colors font-medium"
        >
          Change
        </button>
        <button 
          onClick={onDownload} 
          className="w-full py-2.5 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors font-medium"
        >
          Download
        </button>
      </div>
    </div>
  );
}