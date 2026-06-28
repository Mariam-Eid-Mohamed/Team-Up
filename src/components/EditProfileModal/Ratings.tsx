import { Star } from "lucide-react";
import placeholder from "@/assets/images/profile-placeholder.png";
import { Pagination } from "../Pagination/Pagination"; // Adjust path as needed
import type { Ratings } from "@/interfaces/ProfileInterfaces/profileInterface";

// interface Rating {
//   raterName: string;
//   raterImage?: string;
//   stars: number;
//   comment?: string;
// }

const MOCK_RATINGS: Ratings[] = [
  { raterName: "Sarah Jenkins", stars: 5, comment: "Exceptional developer! Very communicative." },
  { raterName: "Mark Thompson", stars: 4, comment: "Great team player." },
  { raterName: "Elena Rodriguez", stars: 5, comment: "Fantastic to work with!" }
];

interface RatingsSectionProps {
  ratings?: Ratings[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const RatingsSection = ({ 
  ratings=MOCK_RATINGS, 
  currentPage, 
  totalPages, 
  onPageChange 
}: RatingsSectionProps) => {
  return (
    <div >
      <h2 className="text-xl text-[#1F6B6B] font-normal mb-2">Ratings</h2>
      <hr className="bg-gray-500" />

      {ratings.length > 0 ? (
        <div className="flex flex-col">
          {ratings.map((rating, i) => (
            <div key={i} className="flex flex-col">
              <div className="py-4 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <img 
                    src={rating.raterImage ?? placeholder} 
                    alt={rating.raterName} 
                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{rating.raterName}</span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, idx) => (
                        <Star 
                          key={idx} 
                          size={14} 
                          className={idx < rating.stars ? "fill-[#F9D034] text-[#F9D034]" : "text-[#F9D034]"} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {rating.comment && (
                  <p className="text-gray-500 text-sm leading-relaxed pl-13">
                    {rating.comment}
                  </p>
                )}
              </div>
              {i < ratings.length - 1 && <hr className="border-gray-100" />}
            </div>
          ))}
          
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      ) : (
        <div className="min-h-[400px] flex items-center justify-center text-gray-500">
          Student has no ratings yet
        </div>
      )}
    </div>
  );
};
