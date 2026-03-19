import Api from "../Api";

const API_BASE = "/classes";

export type Section = {
  _id: string;
  classId: string;
  section_name: string;
  created_at?: string;
  updatedAt?: string;
  __v?: number;
};

export type GetClassSectionsResponse = {
  status: "success" | "fail" | "error";
  results?: number;
  data: Section[];
};

export const getAllSectionsInClass = async (classId: string, token: string) => {
  return Api.get<GetClassSectionsResponse>(`${API_BASE}/${classId}/sections`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export type JoinSectionResponse = {
  status: "success" | "fail" | "error";
  data: {
    sectionId: string;
    userId: string;
    _id: string;
    joined_at?: string;
    __v?: number;
  };
};

export const joinSection = async (
  classId: string,
  sectionId: string,
  token: string,
) => {
  return Api.post<JoinSectionResponse>(
    `${API_BASE}/${classId}/sections/${sectionId}/join`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
};

export type SectionMember = {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "Student" | "Instructor" | string;
};

export type GetSectionMembersResponse = {
  status: "success" | "fail" | "error";
  results?: number;
  data: SectionMember[];
};

export const getSectionMembers = async (
  classId: string,
  sectionId: string,
  token: string,
) => {
  return Api.get<GetSectionMembersResponse>(
    `${API_BASE}/${classId}/sections/${sectionId}/members`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
};

