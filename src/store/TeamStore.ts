import { create } from "zustand";
export interface TeamMember {
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
  role: string;
}

interface TeamStore {
  members: TeamMember[];
  setMembers: (members: TeamMember[]) => void;
  clearMembers: () => void;
}

export const useTeamStore = create<TeamStore>((set) => ({
  members: [],
  setMembers: (members) => set({ members }),
  clearMembers: () => set({ members: [] }),
}));
