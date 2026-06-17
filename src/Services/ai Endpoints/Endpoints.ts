import Api from "../Api";
import type { TeamSuggestionResponse } from "@/Types/aiTeamSuggestion";
import { normalizeTeamSuggestionResponse } from "./helpers";

const API_BASE = "/ai";

export const suggestTeamMembers = async (
  studentId: string,
  courseworkId: string,
  token: string,
) => {
  const response = await Api.get(`${API_BASE}/suggest-team-members`, {
    params: { studentId, courseworkId },
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    ...response,
    data: normalizeTeamSuggestionResponse(response.data),
  };
};

export const suggestTeamMembersForTeam = async (
  studentId: string,
  teamId: string,
  courseworkId: string,
  token: string,
) => {
  const response = await Api.get(`${API_BASE}/suggest-team-members-for-team`, {
    params: { studentId, teamId, courseworkId },
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    ...response,
    data: normalizeTeamSuggestionResponse(response.data),
  };
};