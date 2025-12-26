import React, { useState } from "react";
import { LogIn, X } from "lucide-react";
import { JoinClassSchema } from "../../utilis/Validations/Validations";
import { joinClass } from "../../Services/class Endpoints/Endpoints";
import { getToken } from "../../utilis/token";

interface JoinClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Optional callback when class is successfully joined
}

const JoinClassModal: React.FC<JoinClassModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [classCode, setClassCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    try {
      JoinClassSchema.parse({
        classCode: classCode || "",
      });
      setError("");
      return true;
    } catch (err: any) {
      if (err.issues && err.issues.length > 0) {
        setError(err.issues[0].message);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Authentication required. Please login again.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await joinClass(classCode.trim(), token);

      if (response.data.success) {
        setSuccessMessage(response.data.message || "Successfully joined the class!");
        // Clear the form
        setClassCode("");
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
        // Close modal after a short delay to show success message
        setTimeout(() => {
          onClose();
          setSuccessMessage("");
        }, 1500);
      } else {
        setError("Failed to join class. Please try again.");
      }
    } catch (error: any) {
      console.error("Failed to join class:", error);
      const errorMessage = error.response?.data?.message || "Failed to join class. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (value: string) => {
    setClassCode(value);
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleClose = () => {
    setClassCode("");
    setError("");
    setSuccessMessage("");
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-800">Join Class</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Section */}
        <div className="space-y-4 text-center mb-10">
          <label className="block text-sm font-semibold text-gray-700">
            Enter Class Code
          </label>
          <input
            type="text"
            placeholder="e.g. , ABC12345"
            value={classCode}
            onChange={(e) => handleInputChange(e.target.value)}
            className={`w-full text-center py-3 px-4 border-b-2 outline-none text-lg transition-colors placeholder:text-gray-300 ${
              error ? "border-red-500" : "border-gray-100 focus:border-[#1B4D49]"
            }`}
          />
          {error && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
          )}
          {successMessage && (
            <p className="text-green-600 text-sm mt-1 font-medium">{successMessage}</p>
          )}
          <p className="text-[11px] text-gray-400 leading-relaxed px-6">
            Enter the 6-character code provided by your instructor to join their class.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 border border-purple-200 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-2.5 bg-[#1B4D49] hover:bg-[#2D7A74] text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Joining...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 rotate-180" /> {/* Rotated to match "enter" direction */}
                <span>Join Class</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinClassModal;