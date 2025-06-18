import { useEffect, useState } from "react";
import api from "../utils/api";
import { showSuccess, showError } from "../utils/toast";
import SkillList from "../components/profile/SkillList";

export default function SkillsPage() {
  const [teachSkill, setTeachSkill] = useState("");
  const [teachLevel, setTeachLevel] = useState("Beginner");
  const [learnSkill, setLearnSkill] = useState("");
  const [learnLevel, setLearnLevel] = useState("Beginner");

  const [skills, setSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [learnLoading, setLearnLoading] = useState(false);

  const fetchSkills = async () => {
    try {
      const res = await api.get("/users/me");
      setSkills(res.data?.teachSkills || []);
      setLearnSkills(res.data?.learnSkills || []);
    } catch {
      showError("Failed to load skills");
    }
  };

  const addSkill = async () => {
    if (!teachSkill || !teachLevel) return;
    setLoading(true);
    try {
      await api.post("/skills/teach", { name: teachSkill, level: teachLevel });
      showSuccess("Skill added");
      setTeachSkill("");
      setTeachLevel("Beginner");
      await fetchSkills();
    } catch (err) {
      showError(err.response?.data?.message || "Error adding skill");
    } finally {
      setLoading(false);
    }
  };

  const removeSkill = async (name) => {
    try {
      await api.delete(`/skills/teach/${name}`);
      showSuccess("Skill removed");
      setSkills((prev) => prev.filter((s) => s.name !== name));
    } catch {
      showError("Failed to remove skill");
    }
  };

  const addLearnSkill = async () => {
    if (!learnSkill || !learnLevel) return;
    setLearnLoading(true);
    try {
      await api.post("/skills/learn", { name: learnSkill, level: learnLevel });
      showSuccess("Learn skill added");
      setLearnSkill("");
      setLearnLevel("Beginner");
      await fetchSkills();
    } catch (err) {
      showError(err.response?.data?.message || "Error adding learn skill");
    } finally {
      setLearnLoading(false);
    }
  };

  const removeLearnSkill = async (name) => {
    try {
      await api.delete(`/skills/learn/${name}`);
      showSuccess("Learn skill removed");
      setLearnSkills((prev) => prev.filter((s) => s.name !== name));
    } catch {
      showError("Failed to remove learn skill");
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-96 -right-96 w-[800px] h-[800px] bg-gradient-to-br from-emerald-400/4 via-green-500/3 to-teal-600/2 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-96 -left-96 w-[800px] h-[800px] bg-gradient-to-tr from-green-400/3 via-teal-500/2 to-emerald-600/2 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-teal-400/2 via-emerald-500/2 to-green-600/1 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-ping opacity-30"
            style={{
              background: `linear-gradient(45deg, 
                ${i % 3 === 0 ? 'rgba(52, 211, 153, 0.4)' : 
                  i % 3 === 1 ? 'rgba(34, 197, 94, 0.4)' : 
                  'rgba(20, 184, 166, 0.4)'}
              )`,
              top: `${15 + (i * 8)}%`,
              left: `${10 + (i * 7)}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: '4s'
            }}
          />
        ))}

        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `
            linear-gradient(rgba(52, 211, 153, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52, 211, 153, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          animation: 'gridMove 15s linear infinite'
        }}></div>
      </div>

      <div className="relative z-10 p-5 lg:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl mb-6 shadow-lg shadow-emerald-500/40">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent mb-3">
              Skill Management
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Build your expertise profile by adding skills you can teach and skills you want to learn
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Teaching Skills Section */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-800/70 via-slate-800/60 to-gray-900/70 backdrop-blur-xl rounded-2xl border border-emerald-500/25 p-6 shadow-xl hover:shadow-emerald-500/15 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-green-500/3 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/30">
                      <span className="text-white text-xl">🎓</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                        Skills I Teach
                      </h2>
                      <p className="text-slate-400 text-sm">Share your expertise with others</p>
                    </div>
                  </div>

                  {/* Add Skill Form */}
                  <div className="bg-gradient-to-r from-emerald-500/8 via-green-500/6 to-teal-500/8 rounded-xl border border-emerald-500/20 p-5 mb-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter skill name..."
                          className="w-full px-4 py-3 bg-gray-900/80 border border-slate-600/40 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all duration-300 backdrop-blur-sm"
                          value={teachSkill}
                          onChange={(e) => setTeachSkill(e.target.value)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 to-green-400/5 rounded-xl opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative">
                          <select
                            value={teachLevel}
                            onChange={(e) => setTeachLevel(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-900/80 border border-slate-600/40 rounded-xl text-white focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                          <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        
                        <button
                          onClick={addSkill}
                          disabled={loading || !teachSkill.trim()}
                          className="px-6 py-3 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 hover:from-emerald-500 hover:via-green-600 hover:to-teal-700 disabled:from-gray-600 disabled:via-gray-700 disabled:to-gray-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-emerald-500/30 disabled:shadow-none relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                          <span className="relative z-10 flex items-center justify-center space-x-2">
                            {loading ? (
                              <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Adding...</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>Add Skill</span>
                              </>
                            )}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Skills List */}
                  <div className="space-y-3">
                    {skills.length > 0 ? (
                      <SkillList skills={skills} editable={true} onRemove={removeSkill} />
                    ) : (
                      <div className="text-center py-12 border-2 border-dashed border-emerald-500/20 rounded-xl bg-emerald-500/5">
                        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500/15 to-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-3xl">🎯</span>
                        </div>
                        <p className="text-slate-400 mb-2">No teaching skills added yet</p>
                        <p className="text-slate-500 text-sm">Add your first skill to start teaching others</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Skills Section */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-800/70 via-slate-800/60 to-gray-900/70 backdrop-blur-xl rounded-2xl border border-teal-500/25 p-6 shadow-xl hover:shadow-teal-500/15 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-green-500/3 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-green-500 rounded-xl flex items-center justify-center shadow-md shadow-teal-500/30">
                      <span className="text-white text-xl">📚</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-400 via-green-400 to-emerald-400 bg-clip-text text-transparent">
                        Skills I Want to Learn
                      </h2>
                      <p className="text-slate-400 text-sm">Discover new areas of knowledge</p>
                    </div>
                  </div>

                  {/* Add Learn Skill Form */}
                  <div className="bg-gradient-to-r from-teal-500/8 via-green-500/6 to-emerald-500/8 rounded-xl border border-teal-500/20 p-5 mb-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter skill you want to learn..."
                          className="w-full px-4 py-3 bg-gray-900/80 border border-slate-600/40 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all duration-300 backdrop-blur-sm"
                          value={learnSkill}
                          onChange={(e) => setLearnSkill(e.target.value)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-400/5 to-green-400/5 rounded-xl opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative">
                          <select
                            value={learnLevel}
                            onChange={(e) => setLearnLevel(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-900/80 border border-slate-600/40 rounded-xl text-white focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                          <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        
                        <button
                          onClick={addLearnSkill}
                          disabled={learnLoading || !learnSkill.trim()}
                          className="px-6 py-3 bg-gradient-to-r from-teal-400 via-green-500 to-emerald-600 hover:from-teal-500 hover:via-green-600 hover:to-emerald-700 disabled:from-gray-600 disabled:via-gray-700 disabled:to-gray-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-teal-500/30 disabled:shadow-none relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                          <span className="relative z-10 flex items-center justify-center space-x-2">
                            {learnLoading ? (
                              <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Adding...</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>Add Skill</span>
                              </>
                            )}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Learn Skills List */}
                  <div className="space-y-3">
                    {learnSkills.length > 0 ? (
                      <SkillList skills={learnSkills} editable={true} onRemove={removeLearnSkill} />
                    ) : (
                      <div className="text-center py-12 border-2 border-dashed border-teal-500/20 rounded-xl bg-teal-500/5">
                        <div className="w-16 h-16 bg-gradient-to-r from-teal-500/15 to-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-3xl">🎯</span>
                        </div>
                        <p className="text-slate-400 mb-2">No learning goals added yet</p>
                        <p className="text-slate-500 text-sm">Add skills you want to master</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-gray-800/70 via-slate-800/60 to-gray-900/70 backdrop-blur-xl rounded-2xl border border-emerald-500/20 p-6 text-center shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🎓</span>
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-transparent mb-2">
                {skills.length}
              </div>
              <div className="text-slate-400 font-medium">Teaching Skills</div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/70 via-slate-800/60 to-gray-900/70 backdrop-blur-xl rounded-2xl border border-teal-500/20 p-6 text-center shadow-lg hover:shadow-teal-500/10 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📚</span>
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-teal-400 via-green-500 to-emerald-600 bg-clip-text text-transparent mb-2">
                {learnSkills.length}
              </div>
              <div className="text-slate-400 font-medium">Learning Goals</div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/70 via-slate-800/60 to-gray-900/70 backdrop-blur-xl rounded-2xl border border-green-500/20 p-6 text-center shadow-lg hover:shadow-green-500/10 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 bg-clip-text text-transparent mb-2">
                {skills.length + learnSkills.length}
              </div>
              <div className="text-slate-400 font-medium">Total Skills</div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
      `}</style>
    </div>
  );
}