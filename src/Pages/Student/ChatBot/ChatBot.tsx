import React, { useEffect, useState } from 'react';
import { Send, Paperclip, MoreVertical, UserPlus, Users, RotateCcw, ChevronDown, Rocket, Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import Bot from "@/assets/images/AI-helper.png";
import AIHelper from "@/assets/images/bot-image.png";
import profilePlaceholder from "@/assets/images/profile-placeholder.png";
import { getToken, getUserId } from "@/utilis/token";
import { useProfileStore } from "@/store/ProfileStore/userProfileStore";
import { suggestTeamMembers, suggestTeamMembersForTeam } from "@/Services/ai Endpoints/Endpoints";
import { sendTeamInvitation } from "@/Services/team Endpoints/Endpoints";
import CreateTeamModal from "@/components/CreateTeamModal/CreateTeamModal";
import type { SuggestedStudent, TeamSuggestionResponse } from "@/Types/aiTeamSuggestion";

type ChatView = 'empty' | 'teammates' | 'teams';
type ChatAction = 'create-team' | 'suggest-members' | 'suggest-teams';

interface ChatMessage {
  role: 'bot' | 'user';
  text: string;
}

interface ChatLocationState {
  courseworkId?: string;
  courseworkName?: string;
}

const ChatBot: React.FC = () => {
  const location = useLocation();
  const locationState = (location.state as ChatLocationState | null) ?? {};
  const courseworkId = locationState.courseworkId;
  const courseworkName = locationState.courseworkName;

  const { profile, fetchProfile, teams: myTeams } = useProfileStore();

  const [view, setView] = useState<ChatView>('empty');
  const [isSidebarOpen] = useState(true);
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);

  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: "Hello! I'm your TeamUp AI Assistant. How can I help you today?" }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestionData, setSuggestionData] = useState<TeamSuggestionResponse | null>(null);
  const [activeAction, setActiveAction] = useState<ChatAction | null>(null);

  const [createdTeamId, setCreatedTeamId] = useState<string | null>(null);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [pendingInviteStudent, setPendingInviteStudent] = useState<SuggestedStudent | null>(null);
  const [invitingStudentId, setInvitingStudentId] = useState<string | null>(null);
  const [invitedStudentIds, setInvitedStudentIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const userId = getUserId();
    const token = getToken();
    if (userId && token) {
      fetchProfile(userId, token);
    }
  }, [fetchProfile]);

  useEffect(() => {
    if (profile?.first_name) {
      setMessages([
        {
          role: 'bot',
          text: `Hello ${profile.first_name}! I'm your TeamUp AI Assistant. How can I help you today?`,
        },
      ]);
    }
  }, [profile?.first_name]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    setMessages([...messages, { role: 'user', text: inputText }]);
    setInputText("");
  };

  const fetchCreateTeamSuggestions = async () => {
    const userId = getUserId();
    const token = getToken();

    if (!courseworkId) {
      const message = "Please open AI Chat from a coursework card to get teammate suggestions.";
      setError(message);
      setMessages((prev) => [...prev, { role: 'bot', text: message }]);
      setView('teammates');
      return;
    }

    if (!userId || !token) {
      const message = "You must be logged in to get teammate suggestions.";
      setError(message);
      setMessages((prev) => [...prev, { role: 'bot', text: message }]);
      setView('teammates');
      return;
    }

    setIsLoading(true);
    setError(null);
    setActiveAction('create-team');
    setView('teammates');
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: 'Help me create a team' },
      { role: 'bot', text: 'Finding classmates who match your skills and this coursework...' },
    ]);

    try {
      const response = await suggestTeamMembers(userId, courseworkId, token);
      const data = response.data;
      setSuggestionData(data);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'bot', text: data.suggestionStatus.message },
      ]);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } } };
      let message =
        axiosErr?.response?.data?.message ??
        "Failed to suggest team members. Please try again.";

      if (axiosErr?.response?.status === 401) {
        message = "Your session has expired or is invalid. Please log in again.";
      }

      setError(message);
      setSuggestionData(null);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'bot', text: message },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestMembersSuggestions = async () => {
    const userId = getUserId();
    const token = getToken();

    if (!courseworkId) {
      const message = "Please open AI Chat from a coursework card to get teammate suggestions.";
      setError(message);
      setMessages((prev) => [...prev, { role: 'bot', text: message }]);
      setView('teammates');
      return;
    }

    if (!userId || !token) {
      const message = "You must be logged in to get teammate suggestions.";
      setError(message);
      setMessages((prev) => [...prev, { role: 'bot', text: message }]);
      setView('teammates');
      return;
    }

    // Find the team for this coursework from profile store teams
    const courseworkTeam = myTeams.find((t) => t.courseworkId === courseworkId);
    if (!courseworkTeam) {
      const message = "You do not have an existing team for this coursework. Please create a team first to use this feature.";
      setError(message);
      setMessages((prev) => [
        ...prev,
        { role: 'user', text: 'Suggest members for my team' },
        { role: 'bot', text: message }
      ]);
      setView('teammates');
      return;
    }

    setIsLoading(true);
    setError(null);
    setActiveAction('suggest-members');
    setView('teammates');
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: 'Suggest members for my team' },
      { role: 'bot', text: `Finding classmates to suggest for your team "${courseworkTeam.teamName}"...` },
    ]);

    try {
      const response = await suggestTeamMembersForTeam(userId, courseworkTeam.teamId, courseworkId, token);
      const data = response.data;
      setSuggestionData(data);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'bot', text: data.suggestionStatus?.message || "Here are some recommended teammates for your team." },
      ]);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } } };
      let message =
        axiosErr?.response?.data?.message ??
        "Failed to suggest team members. Please try again.";

      if (axiosErr?.response?.status === 401) {
        message = "Your session has expired or is invalid. Please log in again.";
      }

      setError(message);
      setSuggestionData(null);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'bot', text: message },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (label: string, actionView: ChatView, action: ChatAction) => {
    if (action === 'create-team') {
      fetchCreateTeamSuggestions();
      return;
    }
    if (action === 'suggest-members') {
      fetchSuggestMembersSuggestions();
      return;
    }

    setActiveAction(action);
    setView(actionView);
    setMessages((prev) => [...prev, { role: 'user', text: label }]);
  };

  const handleRegenerate = () => {
    if (activeAction === 'create-team') {
      fetchCreateTeamSuggestions();
    } else if (activeAction === 'suggest-members') {
      fetchSuggestMembersSuggestions();
    }
  };

  const handleReset = () => {
    setView('empty');
    setError(null);
    setSuggestionData(null);
    setActiveAction(null);
    setCreatedTeamId(null);
    setPendingInviteStudent(null);
    setInvitingStudentId(null);
    setInvitedStudentIds(new Set());
  };

  const sendInvitation = async (teamId: string, student: SuggestedStudent) => {
    const token = getToken();
    if (!token) {
      toast.error("You must be logged in to send invitations.");
      return;
    }

    setInvitingStudentId(student.studentId);

    try {
      const response = await sendTeamInvitation(teamId, student.studentId, token);
      if (response.data?.success) {
        setInvitedStudentIds((prev) => new Set(prev).add(student.studentId));
        const message = `Invitation sent to ${student.name}!`;
        toast.success(response.data.message || message);
        setMessages((prev) => [...prev, { role: 'bot', text: message }]);
      } else {
        toast.error(response.data?.message || "Failed to send team invitation.");
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to send team invitation.";

      if (errorMessage.toLowerCase().includes("invitation is already pending")) {
        setInvitedStudentIds((prev) => new Set(prev).add(student.studentId));
        toast.success("Invitation is already pending for this student.");
        setMessages((prev) => [
          ...prev,
          { role: 'bot', text: `An invitation to ${student.name} is already pending.` },
        ]);
      } else {
        toast.error(errorMessage);
        setMessages((prev) => [...prev, { role: 'bot', text: errorMessage }]);
      }
    } finally {
      setInvitingStudentId(null);
      setPendingInviteStudent(null);
    }
  };

  const handleTeamCreated = async (teamId: string) => {
    setCreatedTeamId(teamId);
    if (pendingInviteStudent) {
      await sendInvitation(teamId, pendingInviteStudent);
    }
  };

  const handleInvite = (student: SuggestedStudent) => {
    if (invitedStudentIds.has(student.studentId)) return;

    if (!courseworkId) {
      toast.error("Please open AI Chat from a coursework card to invite teammates.");
      return;
    }

    if (activeAction === 'suggest-members') {
      const courseworkTeam = myTeams.find((t) => t.courseworkId === courseworkId);
      if (courseworkTeam) {
        sendInvitation(courseworkTeam.teamId, student);
      } else {
        toast.error("No team found for this coursework.");
      }
      return;
    }

    if (createdTeamId) {
      sendInvitation(createdTeamId, student);
      return;
    }

    setPendingInviteStudent(student);
    setIsCreateTeamOpen(true);
    setMessages((prev) => [
      ...prev,
      {
        role: 'bot',
        text: `Create your team first, then I'll send an invitation to ${student.name}.`,
      },
    ]);
  };

  const teams = [
    {
      name: 'Robots',
      project: 'Web development',
      lookingFor: 'Frontend Developer',
      membersCount: '3 out of 4',
      matchScore: 89,
      members: [
        { name: 'Ahmed Ali', role: 'Lead Dev', image: 'https://i.pravatar.cc/150?u=ahmed' },
        { name: 'Sara John', role: 'Backend', image: 'https://i.pravatar.cc/150?u=sara' },
        { name: 'Omar Zeyad', role: 'QA Engineeer', image: 'https://i.pravatar.cc/150?u=omar' },
      ]
    },
    {
      name: 'Geeks',
      project: 'Web development',
      lookingFor: 'UI/UX Designer',
      membersCount: '2 out of 4',
      matchScore: 70,
      members: [
        { name: 'Laila Khaled', role: 'Project Manager', image: 'https://i.pravatar.cc/150?u=laila' },
        { name: 'Youssef M.', role: 'Full Stack', image: 'https://i.pravatar.cc/150?u=yousef' },
      ]
    },
  ];

  const suggestedStudents = suggestionData?.suggestedStudents ?? [];
  const skillsStillNeeded = suggestionData?.skillsStillNeeded ?? [];

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] w-full bg-white font-sans text-slate-800">

      {/* --- LEFT SIDE: Chat Section --- */}
      <aside className={`flex flex-col border-r border-slate-100 bg-white transition-all duration-300 lg:sticky lg:top-[64px] lg:h-[calc(100vh-64px)]
        ${isSidebarOpen ? 'h-auto lg:w-[400px] w-full' : 'h-0 overflow-hidden lg:w-20'}`}>

        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-50 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-600 p-2 text-white shrink-0">
              <img src={Bot} alt="Bot" className="h-6 w-6 rounded-full" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold truncate">AI Assistant</h1>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">Always active</span>
              </div>
            </div>
          </div>
          <MoreVertical className="h-5 w-5 text-slate-400 cursor-pointer shrink-0" />
        </div>

        <div className="flex flex-col flex-1 overflow-hidden relative">
          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin pb-24">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'bot' && (
                  <div className="h-8 w-8 rounded-full border border-emerald-50 flex items-center justify-center bg-transparent shrink-0">
                    <img src={Bot} className="bg-cover bg-center h-auto" alt="bot" />
                  </div>
                )}
                <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed break-words shadow-sm
                  ${msg.role === 'bot' ? 'rounded-tl-none bg-[#D6EFEF] text-slate-700' : 'rounded-tr-none bg-teal-600 text-white'}`}>
                  {msg.text}
                </div>
                {msg.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-[#3DA0A0] overflow-hidden border-2 border-slate-100 shrink-0">
                    <img
                      src={profile?.profile_picture?.storagePath ?? profilePlaceholder}
                      alt="user"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            ))}

            <div className="ml-11 flex flex-col gap-2">
              {[
                { label: 'Help me create a team', icon: <UserPlus size={16} />, v: 'teammates' as ChatView, action: 'create-team' as ChatAction },
                { label: 'Suggest members for my team', icon: <UserPlus size={16} />, v: 'teammates' as ChatView, action: 'suggest-members' as ChatAction },
                { label: 'Suggest teams', icon: <Users size={16} />, v: 'teams' as ChatView, action: 'suggest-teams' as ChatAction }
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickAction(btn.label, btn.v, btn.action)}
                  disabled={isLoading}
                  className="flex w-fit items-center gap-2 rounded-lg border border-[#8C80D9] px-4 py-2 text-sm text-[#8C80D9] hover:bg-[#EFECF8] transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {btn.icon} {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent pt-10">
            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 shadow-sm border border-slate-200/50">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-transparent text-sm outline-none"
              />
              <Paperclip size={18} className="text-indigo-500 cursor-pointer shrink-0" />
              <button onClick={handleSendMessage} className="rounded-full bg-indigo-600 p-2 text-white hover:bg-indigo-700 transition-colors shrink-0">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* --- RIGHT SIDE: Main Results --- */}
      <main className="flex-1 bg-[#FCFBFE] p-4 md:p-8 lg:p-12 transition-all">
        {view === 'empty' && (
          <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
            <img src={AIHelper} alt="Bot Result" className="w-48 lg:w-80 h-auto mb-8 " />
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-800">Your results will appear here</h2>
            <p className="text-sm text-slate-500">Select an option from the menu to get started</p>
          </div>
        )}

        {view === 'teammates' && (activeAction === 'create-team' || activeAction === 'suggest-members') && (
          <div className="max-w-4xl mx-auto pb-10">
            <h2 className="text-xl md:text-2xl font-bold">Recommended Teammates</h2>
            <p className="mb-2 text-sm text-slate-500">
              {suggestionData?.coursework?.name ?? courseworkName ?? "Based on your profile skills and project requirements."}
            </p>

            {/* {suggestionData?.suggestionStatus?.type === 'fallback' && (
              <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
                💡 {suggestionData.suggestionStatus.message || "Notice: No exact skill match was found. Showing fallback suggestions."}
              </div>
            )} */}

            {/* {suggestionData?.team && (
              <div className="mb-6 rounded-xl border border-teal-100 bg-teal-50/50 p-4">
                <p className="text-xs font-bold text-teal-800 uppercase mb-1">
                  Your Team: <span className="normal-case font-semibold text-slate-800">{suggestionData.team.name}</span> ({suggestionData.team.memberCount} members)
                </p>
                {suggestionData.team.combinedSkills?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2 items-center">
                    <span className="text-xs text-slate-500 font-medium">Combined Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {suggestionData.team.combinedSkills.map((skill) => (
                        <span key={skill} className="rounded bg-white border border-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-700 uppercase">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {suggestionData.team.combinedAvailability?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2 items-center text-xs text-slate-500">
                    <span className="font-medium">Combined Availability:</span>
                    <span>{suggestionData.team.combinedAvailability.join(", ")}</span>
                  </div>
                )}
              </div>
            )} */}

            {skillsStillNeeded.length > 0 && (
              <div className="mb-6 rounded-xl border border-amber-100 bg-amber-50 p-4">
                <p className="text-xs font-bold text-amber-700 uppercase mb-2">Skills still needed</p>
                <div className="flex flex-wrap gap-2">
                  {skillsStillNeeded.map((skill) => (
                    <span key={skill} className="rounded bg-white px-2 py-0.5 text-[10px] font-bold text-amber-700 uppercase">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-3" />
                <p className="text-sm">Finding the best teammates for you...</p>
              </div>
            )}

            {!isLoading && error && (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
                {error}
              </div>
            )}

            {!isLoading && !error && (suggestedStudents.length === 0 || suggestionData?.suggestionStatus?.type === 'no_candidates') && suggestionData && (
              <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm text-slate-500">
                {suggestionData.suggestionStatus.message || "No candidates found."}
              </div>
            )}

            {!isLoading && !error && suggestedStudents.length > 0 && suggestionData?.suggestionStatus?.type !== 'no_candidates' && (
              <div className="grid gap-4 mt-8">
                {suggestedStudents.map((person) => (
                  <div key={person.studentId} className="flex flex-col sm:flex-row items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm gap-4">
                    <div className="flex items-center gap-4 w-full min-w-0">
                      <img src={person.profilePicture || profilePlaceholder} className="h-14 w-14 rounded-full object-cover shrink-0" alt={person.name} />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-slate-800 truncate">{person.name}</h3>
                        <p className="text-sm text-[#2E7E7D] font-medium">@{person.username}</p>
                        <p className="mt-1 text-xs text-slate-500 line-clamp-2">{person.reason}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {person.matchedSkills.map((skill) => (
                            <span key={skill} className="rounded bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 uppercase">
                              {skill}
                            </span>
                          ))}
                          {person.skills
                            .filter(
                              (skill) =>
                                !person.matchedSkills.some(
                                  (matched) => matched.toLowerCase() === skill.toLowerCase(),
                                ),
                            )
                            .map((skill) => (
                              <span key={skill} className="rounded bg-[#F5F2FE] px-2 py-0.5 text-[10px] font-bold text-slate-500 uppercase">
                                {skill}
                              </span>
                            ))}
                        </div>
                        {(person.availability.length > 0 || person.gpa != null) && (
                          <p className="mt-2 text-[10px] text-slate-400">
                            {person.availability.length > 0 && (
                              <>Available: {person.availability.join(", ")}</>
                            )}
                            {person.availability.length > 0 && person.gpa != null && " · "}
                            {person.gpa != null && <>GPA: {person.gpa}</>}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-0">
                      <div className="text-right shrink-0">
                        <span className="text-teal-500 font-bold flex items-center gap-1 text-sm">⚡ {person.score.toFixed(0)}%</span>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Match Score</p>
                      </div>
                      <button
                        onClick={() => handleInvite(person)}
                        disabled={
                          invitedStudentIds.has(person.studentId) ||
                          invitingStudentId === person.studentId
                        }
                        className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {invitingStudentId === person.studentId ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : invitedStudentIds.has(person.studentId) ? (
                          "Invited"
                        ) : (
                          "Invite"
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'teams' && (
          <div className="max-w-4xl mx-auto pb-10">
            <h2 className="text-2xl font-bold">Recommended Teams</h2>
            <p className="mb-8 text-sm text-slate-500">Based on your profile skills and project requirements.</p>
            <div className="grid gap-6">
              {teams.map((team, idx) => (
                <div key={idx} className="relative overflow-hidden rounded-2xl border-l-4 border-l-teal-500 border border-slate-100 bg-white shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4 gap-2">
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold flex items-center gap-2 ">Team: {team.name}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 uppercase font-semibold "><Rocket size={12} /> Project: {team.project}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-teal-500 font-bold flex items-center gap-1 text-sm">⚡ {team.matchScore}%</span>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Match Score</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#F5F2FE] p-3 rounded-xl border border-indigo-50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Looking For</p>
                      <p className="text-sm font-semibold text-indigo-600 truncate">{team.lookingFor}</p>
                    </div>
                    <div className="bg-[#F5F2FE] p-3 rounded-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Members</p>
                      <p className="text-sm font-semibold">{team.membersCount}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedTeam(expandedTeam === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-3 border border-slate-300 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors mb-4 group"
                  >
                    View Team Members
                    <ChevronDown size={14} className={`transition-transform ${expandedTeam === idx ? 'rotate-180' : ''}`} />
                  </button>

                  {expandedTeam === idx && (
                    <div className="mb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      {team.members.map((member, midx) => (
                        <div key={midx} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50/50">
                          <img src={member.image} className="h-8 w-8 rounded-full border border-white shadow-sm" alt={member.name} />
                          <div>
                            <p className="text-xs font-bold text-slate-700">{member.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2">
                    Join Team <span className="text-lg">→</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {view !== 'empty' && (
          <div className=" flex justify-center pb-12 gap-4">
            {(activeAction === 'create-team' || activeAction === 'suggest-members') && (
              <button
                onClick={handleRegenerate}
                disabled={isLoading}
                className="flex items-center gap-2 rounded-2xl border border-indigo-200 px-8 py-3 text-indigo-500 font-bold hover:bg-indigo-50 transition-all bg-white shadow-sm disabled:opacity-50"
              >
                <RotateCcw size={18} /> Regenerate answer
              </button>
            )}
          </div>
        )}
      </main>

      {courseworkId && (
        <CreateTeamModal
          isOpen={isCreateTeamOpen}
          onClose={() => {
            setIsCreateTeamOpen(false);
            setPendingInviteStudent(null);
          }}
          courseworkId={courseworkId}
          onTeamCreated={handleTeamCreated}
        />
      )}
    </div>
  );
};

export default ChatBot;
