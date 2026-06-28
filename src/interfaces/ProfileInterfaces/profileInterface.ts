export interface ProfileLink {
  name: string;
  url: string;
}

export interface Rating {
  raterName: string;
  raterUsername: string;
  stars: number;
  comment: string | null;
  createdAt: string;
}

export interface Ratings {
  raterName: string;
  raterImage?: string;
  stars: number;
   comment: string | null;
}

export interface StudentProfileData {
  _id: string;
  user_id: string;
  username: string;
  first_name: string;
  last_name: string;
  fullName: string;
  email: string;
  gpa: number | null;
  availability: "morning" | "evening" | "night" | "all day" | null;
  skills: string[];
  links: ProfileLink[];
  cv: {
    filename: string | null;
    storagePath: string | null;
    uploadedAt: string | null;
  };
  profile_picture: {
    filename: string | null;
    storagePath: string | null;
    uploadedAt: string | null;
  };
  ratings: Ratings[];
}