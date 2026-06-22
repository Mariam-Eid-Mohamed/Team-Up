import type {
  TeamSuggestionResponse,
  SuggestedStudent,
  SuggestTeamsResponse,
  SuggestedTeam,
  SuggestedTeamMemberEvaluation,
} from "@/Types/aiTeamSuggestion";

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

function normalizeMemberEvaluation(
  member: SuggestedTeamMemberEvaluation,
): SuggestedTeamMemberEvaluation {
  return {
    ...member,
    skills: Array.isArray(member.skills) ? member.skills : [],
    matchedSkills: Array.isArray(member.matchedSkills) ? member.matchedSkills : [],
    courseworkMatchedSkills: Array.isArray(member.courseworkMatchedSkills)
      ? member.courseworkMatchedSkills
      : [],
    availability: normalizeAvailability(member.availability),
    profilePicture:
      typeof member.profilePicture === "string"
        ? member.profilePicture
        : (member.profilePicture as { storagePath?: string } | undefined)?.storagePath ||
          undefined,
    score: typeof member.score === "number" ? member.score : 0,
  };
}

function normalizeSuggestedTeam(team: SuggestedTeam): SuggestedTeam {
  return {
    ...team,
    combinedSkills: Array.isArray(team.combinedSkills) ? team.combinedSkills : [],
    combinedAvailability: normalizeAvailability(team.combinedAvailability),
    teamMissingSkills: Array.isArray(team.teamMissingSkills) ? team.teamMissingSkills : [],
    studentMissingSkills: Array.isArray(team.studentMissingSkills)
      ? team.studentMissingSkills
      : [],
    memberEvaluations: (Array.isArray(team.memberEvaluations)
      ? team.memberEvaluations
      : []).map(normalizeMemberEvaluation),
    memberCount: typeof team.memberCount === "number" ? team.memberCount : 0,
    openSlots: typeof team.openSlots === "number" ? team.openSlots : 0,
    score: typeof team.score === "number" ? team.score : 0,
  };
}

export function normalizeSuggestTeamsResponse(raw: unknown): SuggestTeamsResponse {
  const payload =
    (raw as { data?: SuggestTeamsResponse })?.data ?? (raw as SuggestTeamsResponse);

  const suggestedTeams = (Array.isArray(payload.suggestedTeams)
    ? payload.suggestedTeams
    : []).map(normalizeSuggestedTeam);

  return {
    ...payload,
    coursework: payload.coursework ?? {
      id: "",
      name: "",
      requiredSkills: [],
      minTeamSize: 0,
      maxTeamSize: 0,
    },
    student: payload.student
      ? {
          ...payload.student,
          skills: Array.isArray(payload.student.skills) ? payload.student.skills : [],
          availability: normalizeAvailability(payload.student.availability),
        }
      : {
          studentId: "",
          name: "",
          skills: [],
          availability: [],
          gpa: null,
        },
    suggestionStatus: payload.suggestionStatus ?? (
      suggestedTeams.length > 0
        ? { type: "match", message: "Here are some recommended teams." }
        : { type: "no-match", message: "No teams available." }
    ),
    suggestedTeams,
  };
}
