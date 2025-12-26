import React, { useState, useEffect, useRef } from "react";
import { X, Search, Copy, RefreshCw, Loader2, Check, UserPlus } from "lucide-react";
import type { Class, User } from "../../interfaces/interfaces";
import { SearchUsernameSchema } from "../../utilis/Validations/Validations";
import { searchUsersForInvitation, inviteUserToClass, getClassCode } from "../../Services/class Endpoints/Endpoints";
import { getToken } from "../../utilis/token";

interface InviteStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: Class[];
}

export const InviteStudentsModal: React.FC<InviteStudentsModalProps> = ({ isOpen, onClose, classes }) => {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [classCode, setClassCode] = useState<string>("");
  const [isLoadingCode, setIsLoadingCode] = useState(false);
  const [isInviting, setIsInviting] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch class code when class is selected and step 2 is reached
  useEffect(() => {
    if (step === 2 && selectedClassId) {
      fetchClassCode();
    }
  }, [step, selectedClassId]);

  // Search users when username changes (with debounce)
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (username.trim().length >= 2 && selectedClassId) {
      searchTimeoutRef.current = setTimeout(() => {
        handleSearchUsers();
      }, 500);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [username, selectedClassId]);

  const fetchClassCode = async () => {
    if (!selectedClassId) return;
    
    const token = getToken();
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      setIsLoadingCode(true);
      const response = await getClassCode(selectedClassId, token);
      if (response.data.class_code) {
        setClassCode(response.data.class_code);
      }
    } catch (error: any) {
      console.error("Failed to fetch class code:", error);
    } finally {
      setIsLoadingCode(false);
    }
  };

  const handleSearchUsers = async () => {
    if (!selectedClassId || !username.trim()) {
      setSearchResults([]);
      return;
    }

    const token = getToken();
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      setIsSearching(true);
      const response = await searchUsersForInvitation(selectedClassId, username.trim(), token);
      if (response.data.success && response.data.data) {
        setSearchResults(response.data.data);
      } else {
        setSearchResults([]);
      }
    } catch (error: any) {
      console.error("Failed to search users:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInviteUser = async (userId: string) => {
    if (!selectedClassId) return;

    const token = getToken();
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      setIsInviting(userId);
      setInviteSuccess(null);
      const response = await inviteUserToClass(selectedClassId, userId, token);
      
      // Check if the response indicates success (even if status code might be different)
      if (response.data.success || response.status === 200 || response.status === 201) {
        setInviteSuccess(userId);
        // Mark as invited in the UI
        setSearchResults(prev => prev.map(user => 
          user._id === userId ? { ...user, isAlreadyInClass: false } : user
        ));
        setTimeout(() => setInviteSuccess(null), 3000);
      }
    } catch (error: any) {
      console.error("Failed to invite user:", error);
      const errorMessage = error.response?.data?.message || "";
      const statusCode = error.response?.status;
      
      // Check if the error is about user already being in class
      if (errorMessage.toLowerCase().includes("already in this class") || 
          errorMessage.toLowerCase().includes("already a member")) {
        // Mark user as already in class in the UI
        setSearchResults(prev => prev.map(user => 
          user._id === userId ? { ...user, isAlreadyInClass: true } : user
        ));
        // Don't show alert for this case, just update UI
      } 
      // Check if the error is about invitation already pending - treat as success
      else if (errorMessage.toLowerCase().includes("invitation is already pending") ||
               errorMessage.toLowerCase().includes("already pending")) {
        // Show success message since invitation was already sent
        setInviteSuccess(userId);
        setTimeout(() => setInviteSuccess(null), 3000);
      } 
      // If status is 200/201 but axios threw error, still treat as success
      else if (statusCode === 200 || statusCode === 201) {
        setInviteSuccess(userId);
        setTimeout(() => setInviteSuccess(null), 3000);
      }
      // For any other error, show the error message
      else {
        alert(errorMessage || "Failed to invite user. Please try again.");
      }
    } finally {
      setIsInviting(null);
    }
  };

  const handleCopyCode = async () => {
    if (!classCode) return;
    
    try {
      await navigator.clipboard.writeText(classCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = classCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  if (!isOpen) return null;

  const validateUsername = (): boolean => {
    // Only validate if username is provided (search is optional)
    if (!username || username.trim() === "") {
      setUsernameError("");
      return true;
    }

    try {
      SearchUsernameSchema.parse({
        username: username || "",
      });
      setUsernameError("");
      return true;
    } catch (err: any) {
      if (err.issues && err.issues.length > 0) {
        setUsernameError(err.issues[0].message);
      }
      return false;
    }
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    // Clear error when user starts typing
    if (usernameError) {
      setUsernameError("");
    }
  };

  const handleSelectClass = (id: string) => {
    setSelectedClassId(id);
  };

  const handleNextStep = () => {
    if (selectedClassId) setStep(2);
  };

  const handleClose = () => {
    setStep(1);
    setSelectedClassId(null);
    setUsername("");
    setUsernameError("");
    setSearchResults([]);
    setClassCode("");
    setInviteSuccess(null);
    setCopySuccess(false);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className={`bg-white w-full ${step === 1 ? 'max-w-md' : 'max-w-lg'} rounded-2xl shadow-xl p-6 transition-all duration-300`}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Invite Students</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 1 ? (
          /* STEP 1: SELECT CLASS */
          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-700">Select Class</label>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {classes.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleSelectClass(c.id)}
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${
                    selectedClassId === c.id 
                    ? "border-green-500 bg-green-50/50 ring-1 ring-green-500" 
                    : "border-gray-100 hover:border-gray-300 bg-white"
                  }`}
                >
                  <p className="font-bold text-sm text-gray-800">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.code}</p>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-center text-gray-500 pt-4">Select a class to generate an invite code</p>
            
            <div className="flex gap-3 mt-6">
              <button onClick={handleClose} className="flex-1 py-2.5 border border-purple-200 text-gray-700 rounded-lg font-bold">
                Cancel
              </button>
              <button 
                onClick={handleNextStep}
                disabled={!selectedClassId}
                className="flex-1 py-2.5 bg-[#2D7A74] disabled:bg-gray-300 text-white rounded-lg font-bold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: SEARCH & CODE */
          <div className="space-y-6">
             <label className="text-sm font-semibold text-gray-700">Select Class</label>
             {/* Selected Class Preview */}
             <div className="p-4 border border-green-500 bg-green-50/30 rounded-xl">
                <p className="font-bold text-sm text-gray-800">
                  {classes.find(c => c.id === selectedClassId)?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {classes.find(c => c.id === selectedClassId)?.code}
                </p>
             </div>

             {/* Search Input */}
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search by username" 
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  onBlur={validateUsername}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                    usernameError 
                      ? "border-red-500 focus:ring-red-500/20" 
                      : "border-gray-200 focus:ring-[#2D7A74]/20"
                  }`}
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
                )}
                {usernameError && (
                  <p className="text-red-500 text-xs mt-1">{usernameError}</p>
                )}
             </div>

             {/* Search Results */}
             {username.trim().length >= 2 && searchResults.length > 0 && (
               <div className="border border-gray-200 rounded-xl max-h-[200px] overflow-y-auto">
                 {searchResults.map((user) => (
                   <div
                     key={user._id}
                     className={`p-3 border-b border-gray-100 last:border-b-0 flex items-center justify-between ${
                       user.isAlreadyInClass ? "bg-gray-50 opacity-60" : "hover:bg-gray-50"
                     }`}
                   >
                     <div className="flex-1">
                       <p className="text-sm font-semibold text-gray-800">
                         {user.first_name} {user.last_name}
                       </p>
                       <p className="text-xs text-gray-500">@{user.username}</p>
                       {user.isAlreadyInClass && (
                         <p className="text-xs text-orange-600 mt-1">Already in class</p>
                       )}
                     </div>
                     {!user.isAlreadyInClass && (
                       <button
                         onClick={() => handleInviteUser(user._id)}
                         disabled={isInviting === user._id}
                         className={`ml-3 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                           inviteSuccess === user._id
                             ? "bg-green-500 text-white"
                             : isInviting === user._id
                             ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                             : "bg-[#2D7A74] text-white hover:bg-[#235e59]"
                         }`}
                       >
                         {inviteSuccess === user._id ? (
                           <>
                             <Check className="w-3 h-3" />
                             Invitation sent
                           </>
                         ) : isInviting === user._id ? (
                           <>
                             <Loader2 className="w-3 h-3 animate-spin" />
                             Sending...
                           </>
                         ) : (
                           <>
                             <UserPlus className="w-3 h-3" />
                             Invite
                           </>
                         )}
                       </button>
                     )}
                   </div>
                 ))}
               </div>
             )}

             {username.trim().length >= 2 && !isSearching && searchResults.length === 0 && (
               <div className="text-center py-4 text-sm text-gray-500">
                 No users found
               </div>
             )}

             <div className="text-center font-bold text-gray-400 text-xs">OR</div>

             {/* Invite Code Section */}
             <div className="p-4 bg-green-50/50 border border-green-100 rounded-xl space-y-3">
                <p className="text-xs font-bold text-gray-700">Invite code</p>
                <div className="flex gap-2">
                  <div className="flex-1 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-mono flex items-center justify-center min-h-[40px]">
                    {isLoadingCode ? (
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    ) : classCode ? (
                      classCode
                    ) : (
                      <span className="text-gray-400">No code available</span>
                    )}
                  </div>
                  <button
                    onClick={handleCopyCode}
                    disabled={!classCode || isLoadingCode}
                    className={`p-2 rounded-lg transition-colors ${
                      copySuccess
                        ? "bg-green-500 text-white"
                        : classCode && !isLoadingCode
                        ? "bg-[#2D7A74] text-white hover:bg-[#235e59]"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    title="Copy code"
                  >
                    {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={fetchClassCode}
                    disabled={isLoadingCode}
                    className={`p-2 rounded-lg transition-colors ${
                      isLoadingCode
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gray-600 text-white hover:bg-gray-700"
                    }`}
                    title="Refresh code"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingCode ? "animate-spin" : ""}`} />
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Share this code with students so they can join your class.
                </p>
             </div>

             <div className="flex gap-3 pt-4">
              <button onClick={() => setStep(1)} className="flex-1 py-2.5 border border-purple-200 text-gray-700 rounded-lg font-bold">
                Back
              </button>
              <button 
                onClick={() => {
                  // Validate before closing
                  if (validateUsername()) {
                    handleClose();
                  }
                }} 
                className="flex-1 py-2.5 bg-[#2D7A74] text-white rounded-lg font-bold"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};