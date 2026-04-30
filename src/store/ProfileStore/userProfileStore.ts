// stores/profileStore.ts
import { create } from "zustand";
import type { StudentProfileData } from "@/interfaces/ProfileInterfaces/profileInterface";
import {
  getStudentProfile,
  editStudentProfile,
} from "@/Services/profile Endpoints/Endpoints";

interface ProfileStore {
  profile: StudentProfileData | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saveError: string | null;

  fetchProfile: (userId: string, token: string) => Promise<void>;
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
  isLoading: false,
  isSaving: false,
  error: null,
  saveError: null,

  fetchProfile: async (userId, token) => {
    const { profile, isLoading } = get();
    if (profile !== null || isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const res = await getStudentProfile(userId, token);
      set({ profile: res.data.data, isLoading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      set({
        error: err?.response?.data?.message ?? "Failed to fetch profile.",
        isLoading: false,
      });
    }
  },

  editProfile: async (userId, token, formData) => {
    set({ isSaving: true, saveError: null });
    try {
      const res = await editStudentProfile(userId, token, formData);
      console.log(res.data.data.skills);
      set({ profile: res.data.data, isSaving: false });
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

  clearProfile: () => set({ profile: null, error: null, saveError: null }),
}));
