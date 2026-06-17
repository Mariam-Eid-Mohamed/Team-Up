// stores/profileStore.ts
import { create } from "zustand";
import type { StudentProfileData } from "@/interfaces/ProfileInterfaces/profileInterface";
import {
  getStudentProfile,
  editStudentProfile,
} from "@/Services/profile Endpoints/Endpoints";
import { getStudentTeams } from "@/Services/team Endpoints/Endpoints";

export interface StudentTeamItem {
  teamId: string;
  courseworkId: string;
  classCode: string;
  classColor: string;
  teamName: string;
  courseworkName: string;
}

interface ProfileStore {
  profile: StudentProfileData | null;
  profileUserId: string | null;
  teams: StudentTeamItem[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saveError: string | null;

  fetchProfile: (userId: string, token: string) => Promise<void>;
  fetchTeams: (userId: string, token: string) => Promise<void>;
  editProfile: (
    userId: string,
    token: string,
    formData: FormData,
  ) => Promise<boolean>;
  setProfile: (profile: StudentProfileData) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profile: null,
  profileUserId: null,
  teams: [],
  isLoading: false,
  isSaving: false,
  error: null,
  saveError: null,

  fetchProfile: async (userId, token) => {
    const { profile, profileUserId, isLoading } = get();
    if (isLoading) return;
    if (profile !== null && profileUserId === userId) return;

    set({ isLoading: true, error: null });
    try {
      const [profileRes, teamsRes] = await Promise.all([
        getStudentProfile(userId, token),
        getStudentTeams(userId, token).catch(() => ({ data: { data: [] } }))
      ]);

      const teamsData = (teamsRes.data?.success && Array.isArray(teamsRes.data.data))
        ? teamsRes.data.data
        : [];

      set({
        profile: profileRes.data.data,
        teams: teamsData,
        profileUserId: userId,
        isLoading: false
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      set({
        error: err?.response?.data?.message ?? "Failed to fetch profile.",
        isLoading: false,
      });
    }
  },

  fetchTeams: async (userId, token) => {
    try {
      const res = await getStudentTeams(userId, token);
      if (res.data?.success && Array.isArray(res.data.data)) {
        set({ teams: res.data.data });
      }
    } catch (err) {
      console.error("Failed to fetch teams in store:", err);
    }
  },

  editProfile: async (userId, token, formData) => {
    set({ isSaving: true, saveError: null });
    try {
      const res = await editStudentProfile(userId, token, formData);
      set({ profile: res.data.data, profileUserId: userId, isSaving: false });
      return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errors: string[] = err?.response?.data?.errors ?? [];
      const message: string =
        err?.response?.data?.message ?? "Failed to save profile.";

      set({
        saveError: errors.length === 0 ? message : null,
        isSaving: false,
      });

      throw err;
    }
  },

  setProfile: (profile) => set({ profile }),

  clearProfile: () =>
    set({ profile: null, teams: [], profileUserId: null, error: null, saveError: null }),
}));
