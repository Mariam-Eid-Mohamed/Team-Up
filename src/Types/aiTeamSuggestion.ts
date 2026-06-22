export type SuggestionStatusType = "match" | "fallback" | "no_candidates";

export interface SuggestionStatus {
  type: SuggestionStatusType;
  message: string;
}

export interface SuggestedStudentBreakdown {
  skillScore: number;
  courseworkSkillScore: number;
  availabilityScore: number;
  ratingScore: number;
  gpaScore: number;
}

export interface SuggestedStudent {
  studentId: string;
  profileId: string;
  name: string;
  username: string;
  email: string;
  skills: string[];
  availability: string[];
  gpa: number | null;
  score: number;
  matchedSkills: string[];
  courseworkMatchedSkills: string[];
  breakdown: SuggestedStudentBreakdown;
  reason: string;
  profilePicture?: string;
}

export interface TeamSuggestionCoursework {
  id: string;
  name: string;
  requiredSkills: string[];
  minTeamSize: number;
  maxTeamSize: number;
}

export interface TeamSuggestionCreator {
  studentId: string;
  name: string;
  skills: string[];
  availability: string[];
  gpa: number | null;
}

export interface TeamSuggestionTeam {
  teamId: string;
  name: string;
  memberCount: number;
  combinedSkills: string[];
  combinedAvailability: string[];
}

export interface TeamSuggestionResponse {
  coursework: TeamSuggestionCoursework;
  creator?: TeamSuggestionCreator;
  team?: TeamSuggestionTeam;
  skillsStillNeeded: string[];
  suggestionStatus: SuggestionStatus;
  suggestedStudents: SuggestedStudent[];
}

export type TeamsSuggestionStatusType = "match" | "no-match";

export interface TeamsSuggestionStatus {
  type: TeamsSuggestionStatusType;
  message: string;
}

export interface TeamSuggestionStudent {
  studentId: string;
  name: string;
  skills: string[];
  availability: string[];
  gpa: number | null;
}

export interface SuggestedTeamMemberEvaluation {
  studentId: string;
  profileId: string;
  name: string;
  username: string;
  profilePicture?: string;
  skills: string[];
  availability: string[];
  gpa: number | null;
  score: number;
  matchedSkills: string[];
  courseworkMatchedSkills: string[];
  breakdown: SuggestedStudentBreakdown;
}

export interface SuggestedTeamBreakdown {
  aggregateScore: number;
  averageMemberScore: number;
  baseScore: number;
  vacancyBoost: number;
  teamQualityBoost: number;
}

export interface SuggestedTeam {
  teamId: string;
  name: string;
  classId: string;
  courseworkId: string;
  leaderId: string;
  memberCount: number;
  openSlots: number;
  combinedSkills: string[];
  combinedAvailability: string[];
  teamMissingSkills: string[];
  studentMissingSkills: string[];
  memberEvaluations: SuggestedTeamMemberEvaluation[];
  baseScore: number;
  vacancyBoost: number;
  teamQualityBoost: number;
  score: number;
  breakdown: SuggestedTeamBreakdown;
  reason: string;
}

export interface SuggestTeamsResponse {
  coursework: TeamSuggestionCoursework;
  student: TeamSuggestionStudent;
  suggestionStatus: TeamsSuggestionStatus;
  suggestedTeams: SuggestedTeam[];
}
