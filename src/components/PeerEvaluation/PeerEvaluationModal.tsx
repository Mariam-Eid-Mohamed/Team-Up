import { useState } from "react";
import { X, Crown, Star, Loader2, Check } from "lucide-react";
import toast from "react-hot-toast";

interface Member {
  id: string | number;
  name: string;
  role?: string;
}

interface PeerEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  teammates: Member[];
  classColor?: string;
}

export default function PeerEvaluationModal({
  isOpen,
  onClose,
  teammates,
  classColor = "#2D7A78",
}: PeerEvaluationModalProps) {
  const [ratingStep, setRatingStep] = useState<"rating" | "success">("rating");
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const [currentRating, setCurrentRating] = useState(0);
  const [currentComment, setCurrentComment] = useState("");
  const [submittingRatings, setSubmittingRatings] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState<any[]>([]);

  if (!isOpen) return null;

  const handleNextOrFinishRating = async () => {
    if (currentRating === 0) {
      toast.error("Please provide a rating before proceeding.");
      return;
    }

    const currentMember = teammates[currentMemberIndex];
    const newEvaluation = {
      memberId: currentMember.id,
      rating: currentRating,
      comment: currentComment.trim(),
    };

    const updatedResults = [...evaluationResults, newEvaluation];
    setEvaluationResults(updatedResults);

    if (currentMemberIndex < teammates.length - 1) {
      // Advance to next member
      setCurrentMemberIndex((prev) => prev + 1);
      setCurrentRating(0);
      setCurrentComment("");
    } else {
      // Last member evaluated -> Handle submit
      setSubmittingRatings(true);
      try {
        // Replace this with your actual API submission callback if needed
        // await onSubmit(updatedResults);
        setRatingStep("success");
      } catch (err) {
        toast.error("Failed to submit peer evaluations.");
      } finally {
        setSubmittingRatings(false);
      }
    }
  };

  const handleResetAndClose = () => {
    // Reset states back to initial before closing down completely
    setCurrentMemberIndex(0);
    setCurrentRating(0);
    setCurrentComment("");
    setEvaluationResults([]);
    setRatingStep("rating");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[9999] backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-[480px] shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200 p-6 relative md:p-8">
        
        {ratingStep === "rating" ? (
          <>
            {/* Close Button Icon */}
            <button 
              onClick={handleResetAndClose}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Rate Your Teammates</h2>
              <p className="text-gray-400 text-xs mt-1">Please rate each of your teammates.</p>
            </div>

            {/* Custom Node Tracking Progress Bar Line Stepper */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex-1 relative flex items-center">
                <div className="absolute left-0 right-0 h-0.5 bg-gray-200 z-0" />
                <div 
                  className="absolute left-0 h-0.5 bg-[#2D7A78] transition-all duration-300 z-0" 
                  style={{ 
                    width: `${(currentMemberIndex / Math.max(1, teammates.length - 1)) * 100}%` 
                  }} 
                />
                <div className="w-full flex justify-between relative z-10">
                  {teammates.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                        idx <= currentMemberIndex ? "bg-[#2D7A78]" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-xs font-semibold text-gray-400 whitespace-nowrap min-w-[32px] text-right">
                {currentMemberIndex + 1} of {teammates.length}
              </span>
            </div>

            {/* Teammate Profile Segment Card */}
            <div className="flex items-center gap-3 border-b border-gray-100 pb-6 mb-6">
              <div 
                className="w-12 h-12 rounded-full border border-gray-200 flex-shrink-0 flex items-center justify-center font-bold text-white uppercase text-base"
                style={{ backgroundColor: classColor }}
              >
                {teammates[currentMemberIndex]?.name?.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-base text-gray-900">
                    {teammates[currentMemberIndex]?.name}
                  </h4>
                  {teammates[currentMemberIndex]?.role === "LEADER" && (
                    <span className="flex items-center gap-1 text-[10px] text-yellow-600 font-bold bg-yellow-50 px-1.5 py-0.5 rounded-full">
                      <Crown size={10} className="fill-yellow-600" />
                      Leader
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Section 1</p>
              </div>
            </div>

            {/* Interactive Stars Selection */}
            <div className="flex items-center justify-between mb-6">
              <span className="font-semibold text-sm text-gray-700">Rating</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setCurrentRating(star)}
                    className="p-0.5 focus:outline-none transition-transform active:scale-125"
                  >
                    <Star
                      size={24}
                      className={`transition-colors ${
                        star <= currentRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Area Input Row */}
            <div className="mb-8">
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Add a comment (optional)
              </label>
              <div className="relative">
                <textarea
                  value={currentComment}
                  onChange={(e) => setCurrentComment(e.target.value.slice(0, 250))}
                  placeholder="Write your comment here..."
                  rows={4}
                  className="w-full text-sm border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2D7A78]/20 focus:border-[#2D7A78] transition-all resize-none placeholder:text-gray-300 text-gray-800"
                />
                <span className="absolute bottom-3 right-3 text-[11px] text-gray-300">
                  {currentComment.length}/250
                </span>
              </div>
            </div>

            {/* Navigation Buttons Row */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-600 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleNextOrFinishRating}
                disabled={currentRating === 0 || submittingRatings}
                className="flex-1 px-4 py-2.5 bg-[#2D7A78] hover:bg-[#23615f] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {submittingRatings ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : currentMemberIndex === teammates.length - 1 ? (
                  "Finish"
                ) : (
                  "Next"
                )}
              </button>
            </div>
          </>
        ) : (
          /* --- Thank You Success Window View --- */
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 bg-[#ebf5f4] border border-[#c1e0dc] text-[#2D7A78] rounded-full flex items-center justify-center mb-6">
              <Check size={32} strokeWidth={2.5} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
            
            <p className="text-gray-500 text-sm max-w-[280px] leading-relaxed mb-8">
              You have rated all your teammates. Your feedback is important.
            </p>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full max-w-[240px] px-6 py-2.5 bg-[#2D7A78] hover:bg-[#23615f] text-white font-bold rounded-xl text-sm transition-colors cursor-pointer shadow-sm"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}