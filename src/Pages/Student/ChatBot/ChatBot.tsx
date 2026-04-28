import React, { useState } from 'react';
import { Send, Paperclip, MoreVertical, UserPlus, Users, RotateCcw, ChevronDown, Rocket } from 'lucide-react';
import Bot from "@/assets/images/AI-helper.png";
import AIHelper from "@/assets/images/bot-image.png";

const ChatBot: React.FC = () => {
  const [view, setView] = useState<'empty' | 'teammates' | 'teams'>('empty');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);
  
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello Menna! I'm your TeamUp AI Assistant. How can I help you today?" }
  ]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    setMessages([...messages, { role: 'user', text: inputText }]);
    setInputText("");
  };

  const teammates = [
    { name: 'Dalia Adel', role: 'Frontend Developer', skills: ['REACT', 'TAILWIND', 'TYPESCRIPT'], compatibility: 95, image: 'https://i.pravatar.cc/150?u=dalia' },
    { name: 'Anas Mohamed', role: 'Backend Developer', skills: ['NODE.JS', 'POSTGRESQL', 'AWS'], compatibility: 90, image: 'https://i.pravatar.cc/150?u=anas' },
    { name: 'Mariam Eid', role: 'UI/UX Designer', skills: ['FIGMA', 'PROTOTYPING', 'USER RESEARCH'], compatibility: 95, image: 'https://i.pravatar.cc/150?u=mariam' },
  ];

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
                  <div className="h-8 w-8 rounded-full border border-indigo-100 flex items-center justify-center bg-indigo-50 shrink-0">
                     <img src={Bot} className="w-6" alt="bot" />
                  </div>
                )}
                <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed break-words shadow-sm
                  ${msg.role === 'bot' ? 'rounded-tl-none bg-emerald-50 text-slate-700' : 'rounded-tr-none bg-teal-600 text-white'}`}>
                  {msg.text}
                </div>
                {msg.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden border-2 border-slate-100 shrink-0">
                    <img src="https://i.pravatar.cc/150?u=menna" alt="user" />
                  </div>
                )}
              </div>
            ))}

            <div className="ml-11 flex flex-col gap-2">
              {[
                { label: 'Help me create a team', icon: <UserPlus size={16} />, v: 'teammates' },
                { label: 'Suggest teammates', icon: <UserPlus size={16} />, v: 'teammates' },
                { label: 'Suggest teams', icon: <Users size={16} />, v: 'teams' }
              ].map((btn, i) => (
                <button 
                  key={i}
                  onClick={() => setView(btn.v as any)}
                  className="flex w-fit items-center gap-2 rounded-lg border border-indigo-200 px-4 py-2 text-sm text-indigo-500 hover:bg-indigo-50 transition-colors whitespace-nowrap"
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
      <main className="flex-1 bg-slate-50/30 p-4 md:p-8 lg:p-12 transition-all">
        {view === 'empty' && (
          <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
            <img src={AIHelper} alt="Bot Result" className="w-48 lg:w-64 mb-8 animate-pulse" />
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-800">Your results will appear here</h2>
          </div>
        )}

        {view === 'teammates' && (
          <div className="max-w-4xl mx-auto pb-10">
            <h2 className="text-xl md:text-2xl font-bold">Recommended Teammates</h2>
            <p className="mb-8 text-sm text-slate-500">Based on your profile skills and project requirements.</p>
            <div className="grid gap-4 mt-8">
              {teammates.map((person, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm gap-4">
                  <div className="flex items-center gap-4 w-full min-w-0">
                    <img src={person.image} className="h-14 w-14 rounded-full object-cover shrink-0" alt={person.name} />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-800 truncate">{person.name}</h3>
                      <p className="text-sm text-teal-500 font-medium">{person.role}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {person.skills.map(s => (
                          <span key={s} className="rounded bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-400 uppercase">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-0">
                    <span className="text-teal-500 font-bold text-sm whitespace-nowrap">⚡ {person.compatibility}%</span>
                    <button className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white whitespace-nowrap">Invite</button>
                  </div>
                </div>
              ))}
            </div>
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
                        <h3 className="text-lg font-bold flex items-center gap-2 truncate">Team: {team.name}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 uppercase font-semibold truncate"><Rocket size={12}/> Project: {team.project}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-teal-500 font-bold flex items-center gap-1 text-sm">⚡ {team.matchScore}%</span>
                        <p className="text-[10px] text-slate-300 font-bold uppercase">Match Score</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-50">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Looking For</p>
                        <p className="text-sm font-semibold text-indigo-600 truncate">{team.lookingFor}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Members</p>
                        <p className="text-sm font-semibold">{team.membersCount}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setExpandedTeam(expandedTeam === idx ? null : idx)}
                      className="w-full flex items-center justify-between px-4 py-2 border border-slate-100 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors mb-4 group"
                    >
                      View Team Members 
                      <ChevronDown size={14} className={`transition-transform ${expandedTeam === idx ? 'rotate-180' : ''}`} />
                    </button>

                    {/* DUMMY TEAM MEMBERS LIST */}
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
          <div className=" flex justify-center pb-12">
            <button onClick={() => setView('empty')} className="flex items-center gap-2 rounded-2xl border border-indigo-200 px-8 py-3 text-indigo-500 font-bold hover:bg-indigo-50 transition-all bg-white shadow-sm">
              <RotateCcw size={18} /> Regenerate answer
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatBot;