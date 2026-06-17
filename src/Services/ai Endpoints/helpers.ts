import type { TeamSuggestionResponse, SuggestedStudent } from "@/Types/aiTeamSuggestion";

export function normalizeAvailability(availability: unknown): string[] {
  if (Array.isArray(availability)) {
    return availability.map(String).filter(Boolean);
  }
  if (typeof availability === "string" && availability.trim()) {
    return [availability];
  }
  return [];
}

function normalizeSuggestedStudent(student: SuggestedStudent): SuggestedStudent {
  return {
    ...student,
    skills: Array.isArray(student.skills) ? student.skills : [],
    matchedSkills: Array.isArray(student.matchedSkills) ? student.matchedSkills : [],
    courseworkMatchedSkills: Array.isArray(student.courseworkMatchedSkills)
      ? student.courseworkMatchedSkills
      : [],
    availability: normalizeAvailability(student.availability),
    profilePicture: typeof student.profilePicture === "string"
      ? student.profilePicture
      : (student.profilePicture as any)?.storagePath || undefined,
    score: typeof student.score === "number" ? student.score : 0,
  };
}

export function normalizeTeamSuggestionResponse(raw: unknown): TeamSuggestionResponse {
  const payload =
    (raw as { data?: TeamSuggestionResponse })?.data ?? (raw as TeamSuggestionResponse);

  return {
    ...payload,
    creator: payload.creator
      ? {
          ...payload.creator,
          skills: Array.isArray(payload.creator.skills) ? payload.creator.skills : [],
          availability: normalizeAvailability(payload.creator.availability),
        }
      : payload.creator,
    team: payload.team
      ? {
          ...payload.team,
          combinedSkills: Array.isArray(payload.team.combinedSkills)
            ? payload.team.combinedSkills
            : [],
          combinedAvailability: normalizeAvailability(payload.team.combinedAvailability),
        }
      : payload.team,
    skillsStillNeeded: Array.isArray(payload.skillsStillNeeded)
      ? payload.skillsStillNeeded
      : [],
    suggestionStatus: payload.suggestionStatus ?? (
      (Array.isArray(payload.suggestedStudents) && payload.suggestedStudents.length > 0)
        ? { type: "match", message: "Here are some recommended teammates." }
        : { type: "no_candidates", message: "No suggestions available." }
    ),
    suggestedStudents: (Array.isArray(payload.suggestedStudents)
      ? payload.suggestedStudents
      : []
    ).map(normalizeSuggestedStudent),
  };
}
