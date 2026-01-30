export type Author = {
  _id: string;
  first_name: string;
  last_name: string;
  role: "Instructor" | "Student";
};

export type CourseworkFile = {
  _id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  uploaded_by: string;
  uploaded_at: string;
};

export type Coursework = {
  _id: string;
  name: string;
  description?: string;
  grade: number | null;
  team_size_min: number | null;
  team_size_max: number | null;
  deadline: string;
  files: CourseworkFile[];
};

export type Post =
  | {
      _id: string;
      type: "ANNOUNCEMENT";
      classId: string;
      authorId: Author;
      announcement_text: string;
      createdAt: string;
      updatedAt: string;
    }
  | {
      _id: string;
      type: "COURSEWORK";
      classId: string;
      authorId: Author;
      courseworkId: Coursework;
      createdAt: string;
      updatedAt: string;
    };
