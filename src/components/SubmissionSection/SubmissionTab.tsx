import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSessionStore } from "../../store/sessionStore";
import { submitCoursework, getTeamSubmission } from "../../Services/team Endpoints/Endpoints";
import toast from "react-hot-toast";
import { FileText, X, Loader2, UploadCloud } from "lucide-react";

interface SubmissionTabProps {
  teamData: any;
  isInstructor: boolean;
  onUpload?: (file: File) => Promise<void>;
  onDownload?: () => void;
}

export default function SubmissionTab({ teamData, isInstructor }: SubmissionTabProps) {
  const { teamId } = useParams<{ teamId: string }>();
  const token = useSessionStore((state) => state.token);
  const userId = useSessionStore((state) => state.userId);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [error, setError] = useState("");
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);

  useEffect(() => {
    const fetchSubmission = async () => {
      if (!teamId || !token) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError("");
        const response = await getTeamSubmission(teamId, token);
        if (response.data?.success) {
          setSubmission(response.data.data);
        }
      } catch (err: any) {
        const msg = err.response?.data?.message || "";
        if (msg === "This team has not submitted the coursework yet.") {
          setSubmission(null);
        } else {
          setError(msg || "Failed to load submission.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, [teamId, token]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadClick = async () => {
    if (!selectedFile || !teamId || !token) return;
    setIsUploading(true);
    try {
      const response = await submitCoursework(teamId, selectedFile, token);
      if (response.data?.success) {
        toast.success(response.data.message || "Coursework submitted successfully.");
        setSubmission(response.data.data);
        setSelectedFile(null);
        setIsChanging(false);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to submit coursework.";
      toast.error(msg);
      if (msg === "Submission deadline has passed.") {
        setIsDeadlinePassed(true);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (submission?.file_url) {
      window.open(submission.file_url, "_blank");
    } else {
      toast.error("No file URL available to download.");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatSubmissionDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "Unknown Date";
      
      const day = date.getDate().toString().padStart(2, "0");
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      
      return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
    } catch (e) {
      return dateStr;
    }
  };

  const getSubmittedByName = (submittedBy: any) => {
    if (!submittedBy) return "Unknown";
    if (typeof submittedBy === "object") {
      return `${submittedBy.first_name || ""} ${submittedBy.last_name || ""}`.trim() || "Unknown";
    }
    const member = teamData?.teamMembers?.find((m: any) => m.id === submittedBy || m._id === submittedBy);
    if (member) return member.name;
    if (submittedBy === userId) return "You";
    return "Team Member";
  };

  if (loading) {
    return (
      <div className="border border-teal-100 rounded-2xl p-12 bg-white flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2D7A78]" />
        <p className="text-gray-500 mt-2 text-sm">Loading submission...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-100 rounded-2xl p-12 bg-white flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-red-500 font-medium mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-[#2D7A78] text-white rounded-lg hover:bg-[#23615f] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Instructor View
  if (isInstructor) {
    return (
      <div className="border-2 border-teal-100 rounded-2xl p-12 bg-white flex flex-col items-center justify-center min-h-[400px]">
        {submission ? (
          <>
            <FileText size={48} className="text-teal-200 mb-4" strokeWidth={1} />
            <p className="text-gray-400 text-sm mb-1">{formatFileSize(submission.file_size)}</p>
            <p className="font-semibold text-gray-700 mb-2">{submission.file_name}</p>
            
            <div className="text-center text-sm text-gray-500 mb-8 space-y-1">
              <p>Submitted by: <span className="font-semibold text-gray-700">{getSubmittedByName(submission.submitted_by)}</span></p>
              <p>Submitted on: <span className="font-semibold text-gray-700">{formatSubmissionDate(submission.submitted_at)}</span></p>
            </div>
            
            <button 
              onClick={handleDownload}
              className="w-full max-w-[240px] py-2.5 bg-[#2D7A78] text-white rounded-lg hover:bg-[#23615f] transition-colors font-medium"
            >
              Download
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="bg-teal-50 p-4 rounded-full mb-4">
              <FileText size={32} className="text-teal-200" />
            </div>
            <p className="text-gray-500 font-medium">No submission has been uploaded yet.</p>
            <p className="text-gray-400 text-sm mt-1">
              The team has not uploaded any files for this project.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Student View - 1. Initial Empty State OR Changing (but no file selected yet)
  if (!submission && !selectedFile || (isChanging && !selectedFile)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
        <label className="border-2 border-dashed border-teal-200 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-teal-50/50 transition-all bg-white w-full h-full min-h-[400px]">
          <UploadCloud size={48} className="text-[#2D7A78] mb-4" />
          <p className="text-[#2D7A78] font-medium hover:underline">click to browse</p>
          <p className="text-xs text-gray-400 mt-2 bg-teal-100 px-3 py-1 rounded-full">PDF/ ZIP/ PNG - Max 20 MB</p>
          <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.zip,.png" />
        </label>
        {isChanging && (
          <button
            onClick={() => setIsChanging(false)}
            className="mt-4 px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    );
  }

  // Student View - 2. Pending Submission
  if (selectedFile) {
    return (
      <div className="border-2 border-dashed border-teal-200 rounded-2xl p-12 flex flex-col items-center justify-center bg-white min-h-[400px] w-full">
        <UploadCloud size={48} className="text-[#2D7A78] mb-4" />
        <p className="text-[#2D7A78] font-medium hover:underline">click to browse</p>
        <div className="text-xs text-[#2D7A78] bg-teal-50 px-3 py-1 rounded-full mb-6">
          PDF/ ZIP/ PNG - Max 25 MB
        </div>
        
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

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          {isChanging && (
            <button
              onClick={() => {
                setSelectedFile(null);
                setIsChanging(false);
              }}
              disabled={isUploading}
              className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          )}
          <button 
            onClick={handleUploadClick}
            disabled={isUploading || isDeadlinePassed}
            className="flex-1 py-2.5 bg-[#2D7A78] text-white rounded-lg hover:bg-[#23615f] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? <Loader2 className="animate-spin" /> : "Submit"}
          </button>
        </div>
        {isDeadlinePassed && (
          <p className="text-red-500 text-xs mt-2 font-medium">Submission deadline has passed.</p>
        )}
      </div>
    );
  }

  // Student View - 3. Submitted State
  return (
    <div className="border border-teal-100 rounded-2xl p-12 bg-white flex flex-col items-center justify-center min-h-[400px]">
      <FileText size={48} className="text-teal-200 mb-4" strokeWidth={1} />
      
      <p className="text-gray-400 text-sm mb-1">{formatFileSize(submission.file_size)}</p>
      <p className="font-semibold text-gray-700 mb-2">{submission.file_name}</p>

      <div className="text-center text-sm text-gray-500 mb-8 space-y-1">
        <p>Submitted by: <span className="font-semibold text-gray-700">{getSubmittedByName(submission.submitted_by)}</span></p>
        <p>Submitted on: <span className="font-semibold text-gray-700">{formatSubmissionDate(submission.submitted_at)}</span></p>
      </div>
      
      <div className="flex flex-col gap-3 w-full max-w-[240px]">
        <button 
          onClick={() => setIsChanging(true)}
          className="w-full py-2.5 border border-teal-600 text-teal-700 rounded-lg hover:bg-teal-50 transition-colors font-medium"
        >
          Change
        </button>
        <button 
          onClick={handleDownload} 
          className="w-full py-2.5 bg-[#2D7A78] text-white rounded-lg hover:bg-[#23615f] transition-colors font-medium"
        >
          Download
        </button>
      </div>
    </div>
  );
}