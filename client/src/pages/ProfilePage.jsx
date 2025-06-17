// client/src/pages/ProfilePage.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/api";
import { showSuccess, showError } from "../utils/toast";
import { loginUser } from "../redux/slices/authSlice";
import { setProfile, updateProfile } from "../redux/slices/userSlice";
import EditProfile from "../components/profile/EditProfile";
import ProfileCard from "../components/profile/ProfileCard";
import SkillList from "../components/profile/SkillList";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
  });

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
  });

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        const userData = res.data;

        setForm({
          name: userData.name || "",
          email: userData.email || "",
          bio: userData.bio || "",
          location: userData.location || "",
        });

        setProfileData({
          name: userData.name || "",
          email: userData.email || "",
          bio: userData.bio || "",
          location: userData.location || "",
        });

        dispatch(setProfile(userData));

        setSkills([
          ...(userData.teachSkills || []).map((s) => ({
            name: s.name,
            level: s.level,
            type: "teach",
          })),
          ...(userData.learnSkills || []).map((s) => ({
            name: s.name,
            level: s.level,
            type: "learn",
          })),
        ]);
      } catch (err) {
        showError("Failed to load user profile");
      }
    };

    fetchUser();
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/users/profile", form);
      showSuccess("Profile updated successfully");
      
      setProfileData({
        name: form.name,
        email: form.email,
        bio: form.bio,
        location: form.location,
      });
      
      dispatch(updateProfile(res.data));
      dispatch(setProfile(res.data));
      
      setIsEditing(false);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const teachSkills = skills.filter(skill => skill.type === 'teach');
  const learnSkills = skills.filter(skill => skill.type === 'learn');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
    { id: 'skills', name: 'Skills', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )}
  ];

  const stats = [
    { 
      label: 'Skills to Teach', 
      value: teachSkills.length, 
      color: 'from-emerald-400 via-green-500 to-teal-600', 
      icon: '🎓',
      bgGlow: 'bg-emerald-500/15 border-emerald-400/25 shadow-emerald-500/20'
    },
    { 
      label: 'Skills to Learn', 
      value: learnSkills.length, 
      color: 'from-green-400 via-teal-500 to-emerald-600', 
      icon: '📚',
      bgGlow: 'bg-green-500/15 border-green-400/25 shadow-green-500/20'
    },
    { 
      label: 'Connections', 
      value: '12', 
      color: 'from-teal-400 via-emerald-500 to-green-600', 
      icon: '🤝',
      bgGlow: 'bg-teal-500/15 border-teal-400/25 shadow-teal-500/20'
    },
    { 
      label: 'Reviews', 
      value: '8', 
      color: 'from-emerald-300 via-green-400 to-teal-400', 
      icon: '⭐',
      bgGlow: 'bg-yellow-400/15 border-yellow-400/25 shadow-yellow-400/20'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary Orbs */}
        <div className="absolute -top-96 -right-96 w-[800px] h-[800px] bg-gradient-to-br from-emerald-400/5 via-green-500/3 to-teal-600/2 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-96 -left-96 w-[800px] h-[800px] bg-gradient-to-tr from-green-400/4 via-teal-500/3 to-emerald-600/2 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-teal-400/3 via-emerald-500/2 to-green-600/2 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        {/* Secondary Accent Orbs */}
        <div className="absolute top-20 right-20 w-[300px] h-[300px] bg-gradient-to-bl from-emerald-300/4 via-green-400/3 to-teal-400/2 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 left-40 w-[200px] h-[200px] bg-gradient-to-tr from-green-300/3 via-emerald-400/2 to-teal-300/2 rounded-full blur-xl animate-pulse delay-3000"></div>
        
        {/* Floating Particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-ping opacity-40"
            style={{
              background: `linear-gradient(45deg, 
                ${i % 3 === 0 ? 'rgba(52, 211, 153, 0.3)' : 
                  i % 3 === 1 ? 'rgba(34, 197, 94, 0.3)' : 
                  'rgba(20, 184, 166, 0.3)'}
              )`,
              top: `${10 + (i * 6)}%`,
              left: `${5 + (i * 6.5)}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: '4s'
            }}
          />
        ))}

        {/* Animated Grid Pattern */}
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
          {/* Main Profile Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {/* Enhanced Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-800/70 via-slate-800/60 to-gray-900/70 backdrop-blur-xl rounded-2xl border border-emerald-500/20 p-6 shadow-xl hover:shadow-emerald-500/15 transition-all duration-500 hover:border-emerald-400/30 relative overflow-hidden group">
                {/* Card Background Animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-green-500/3 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                
                <div className="text-center relative z-10">
                  <div className="relative inline-block mb-5">
                    <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-emerald-500/40 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <span className="relative z-10">
                        {profileData?.name?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                      {/* Animated Ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-white/15 animate-spin" style={{animationDuration: '6s'}}></div>
                    </div>
                    
                    {/* Enhanced Status Indicator */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center shadow-md shadow-emerald-500/30">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 rounded-full bg-emerald-400/25 animate-ping"></div>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent mb-2">
                    {user?.name || "Your Name"}
                  </h2>
                  <p className="text-emerald-400 font-medium mb-4">
                    {user?.email || "your.email@example.com"}
                  </p>
                  
                  {user?.location && (
                    <div className="flex items-center justify-center space-x-2 mb-4 p-2 bg-slate-700/25 rounded-xl border border-slate-600/25">
                      <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-slate-300 text-sm font-medium">{user?.location}</span>
                    </div>
                  )}

                  {user?.bio && (
                    <div className="relative mb-4 p-4 bg-gradient-to-r from-slate-700/40 via-gray-700/30 to-slate-800/40 rounded-xl border border-slate-600/30 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/3 via-green-500/2 to-teal-500/3"></div>
                      <p className="text-slate-300 leading-relaxed relative z-10 text-sm italic">
                        "{user.bio}"
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-3 px-6 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 hover:from-emerald-500 hover:via-green-600 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/30 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit Profile</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className={`bg-gradient-to-br from-gray-800/80 via-slate-800/70 to-gray-900/80 backdrop-blur-xl rounded-2xl border ${stat.bgGlow} p-6 text-center hover:border-opacity-50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl group relative overflow-hidden`}
                    style={{ 
                      animationDelay: `${index * 150}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                  >
                    {/* Card Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl"></div>
                    
                    <div className="relative z-10">
                      <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300 filter drop-shadow-md">
                        {stat.icon}
                      </div>
                      <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:text-4xl transition-all duration-300`}>
                        {stat.value}
                      </div>
                      <div className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors duration-300 font-medium uppercase tracking-wide">
                        {stat.label}
                      </div>
                    </div>
                    
                    {/* Floating Background Elements */}
                    <div className="absolute top-1 right-1 w-6 h-6 bg-white/3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-bounce"></div>
                    <div className="absolute bottom-1 left-1 w-4 h-4 bg-white/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-bounce delay-100"></div>
                  </div>
                ))}
              </div>

              {/* Enhanced Navigation Tabs */}
              <div className="bg-gradient-to-r from-gray-800/80 via-slate-800/70 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-slate-600/40 p-3 mb-6 shadow-xl hover:shadow-emerald-500/8 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/2 via-green-500/1 to-teal-500/2 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                
                <div className="flex space-x-3 relative z-10">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center space-x-2 py-3 px-5 rounded-xl font-semibold transition-all duration-500 transform hover:scale-105 relative overflow-hidden group ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 text-white shadow-lg shadow-emerald-500/40 border border-white/15'
                          : 'text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-slate-700/60 hover:to-gray-700/60 hover:shadow-md border border-transparent hover:border-slate-500/25'
                      }`}
                    >
                      {activeTab === tab.id && (
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      )}
                      <div className="relative z-10 flex items-center space-x-2">
                        <div className={`transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'}`}>
                          {tab.icon}
                        </div>
                        <span>{tab.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Content Based on Active Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enhanced Quick Stats */}
              <div className="bg-gradient-to-br from-gray-800/70 via-slate-800/60 to-gray-900/70 backdrop-blur-xl rounded-2xl border border-emerald-500/25 p-6 shadow-xl hover:shadow-emerald-500/15 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-teal-500/3 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3 relative z-10">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shadow-md shadow-emerald-500/30">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 bg-clip-text text-transparent">Profile Overview</span>
                </h3>
                
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-500/12 to-teal-500/8 rounded-xl border border-emerald-500/25 hover:border-emerald-400/40 transition-all duration-300 hover:shadow-md hover:shadow-emerald-500/15">
                    <span className="text-slate-200 font-medium">Profile Completion</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden shadow-inner">
                        <div className="w-4/5 h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-green-500 rounded-full shadow-sm animate-pulse"></div>
                      </div>
                      <span className="text-emerald-400 font-semibold">80%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-500/12 to-emerald-500/8 rounded-xl border border-green-500/25 hover:border-green-400/40 transition-all duration-300 hover:shadow-md hover:shadow-green-500/15">
                    <span className="text-slate-200 font-medium">Skills Added</span>
                    <span className="text-green-400 font-semibold">{skills.length} skills</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-teal-500/12 to-green-500/8 rounded-xl border border-teal-500/25 hover:border-teal-400/40 transition-all duration-300 hover:shadow-md hover:shadow-teal-500/15">
                    <span className="text-slate-200 font-medium">Member Since</span>
                    <span className="text-teal-400 font-semibold">Dec 2024</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Recent Activity */}
              <div className="bg-gradient-to-br from-gray-800/70 via-slate-800/60 to-gray-900/70 backdrop-blur-xl rounded-2xl border border-green-500/25 p-6 shadow-xl hover:shadow-green-500/15 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-teal-500/3 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3 relative z-10">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-teal-500 rounded-lg flex items-center justify-center shadow-md shadow-green-500/30">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="bg-gradient-to-r from-green-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">Recent Activity</span>
                </h3>
                
                <div className="space-y-4 relative z-10">
                  {[
                    { icon: '🎯', bg: 'from-emerald-500/15 to-green-500/8', border: 'border-emerald-500/25', text: 'Profile updated', time: '2 hours ago', color: 'text-emerald-400' },
                    { icon: '📚', bg: 'from-green-500/15 to-teal-500/8', border: 'border-green-500/25', text: 'New skill added', time: '1 day ago', color: 'text-green-400' },
                    { icon: '🤝', bg: 'from-teal-500/15 to-emerald-500/8', border: 'border-teal-500/25', text: 'New connection', time: '3 days ago', color: 'text-teal-400' }
                  ].map((activity, index) => (
                    <div key={index} className={`flex items-center space-x-4 p-4 bg-gradient-to-r ${activity.bg} rounded-xl border ${activity.border} hover:border-opacity-50 transition-all duration-300 hover:shadow-md hover:-translate-y-1 group`}>
                      <div className={`w-10 h-10 bg-gradient-to-r ${activity.bg} rounded-full flex items-center justify-center shadow-md border ${activity.border} group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-lg">{activity.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{activity.text}</p>
                        <p className={`${activity.color} text-sm font-medium`}>{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enhanced Teaching Skills */}
              <div className="bg-gradient-to-br from-gray-800/70 via-slate-800/60 to-gray-900/70 backdrop-blur-xl rounded-2xl border border-emerald-500/25 p-6 shadow-xl hover:shadow-emerald-500/15 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-green-500/3 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3 relative z-10">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-lg flex items-center justify-center shadow-md shadow-emerald-500/30">
                    <span className="text-white text-lg">🎓</span>
                  </div>
                  <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">Skills I Teach</span>
                </h3>
                
                {teachSkills.length > 0 ? (
                  <div className="grid gap-4 relative z-10">
                    {teachSkills.map((skill, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gradient-to-r from-emerald-500/12 to-green-500/8 border border-emerald-500/25 rounded-xl hover:bg-gradient-to-r hover:from-emerald-500/15 hover:to-green-500/10 hover:border-emerald-400/40 transition-all duration-300 group hover:-translate-y-1 hover:shadow-md hover:shadow-emerald-500/15 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/3 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl"></div>
                        
                        <div className="flex justify-between items-center relative z-10">
                          <span className="text-white font-semibold">{skill.name}</span>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 transition-all duration-300 ${i < skill.level ? 'text-yellow-400 drop-shadow-sm scale-105' : 'text-gray-600'} hover:scale-110`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500/15 to-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🎓</span>
                    </div>
                    <p className="text-slate-400">No teaching skills added yet</p>
                    <p className="text-slate-500 text-sm mt-1">Add your expertise to start teaching others</p>
                  </div>
                )}
              </div>

              {/* Enhanced Learning Skills */}
              <div className="bg-gradient-to-br from-gray-800/70 via-slate-800/60 to-gray-900/70 backdrop-blur-xl rounded-2xl border border-teal-500/25 p-6 shadow-xl hover:shadow-teal-500/15 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-green-500/3 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3 relative z-10">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-green-500 rounded-lg flex items-center justify-center shadow-md shadow-teal-500/30">
                    <span className="text-white text-lg">📚</span>
                  </div>
                  <span className="bg-gradient-to-r from-teal-400 via-green-400 to-emerald-400 bg-clip-text text-transparent">Skills I Want to Learn</span>
                </h3>
                
                {learnSkills.length > 0 ? (
                  <div className="grid gap-4 relative z-10">
                    {learnSkills.map((skill, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gradient-to-r from-teal-500/12 to-green-500/8 border border-teal-500/25 rounded-xl hover:bg-gradient-to-r hover:from-teal-500/15 hover:to-green-500/10 hover:border-teal-400/40 transition-all duration-300 group hover:-translate-y-1 hover:shadow-md hover:shadow-teal-500/15 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/3 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl"></div>
                        
                        <div className="flex justify-between items-center relative z-10">
                          <span className="text-white font-semibold">{skill.name}</span>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 transition-all duration-300 ${i < skill.level ? 'text-yellow-400 drop-shadow-sm scale-105' : 'text-gray-600'} hover:scale-110`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-r from-teal-500/15 to-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">📚</span>
                    </div>
                    <p className="text-slate-400">No learning skills added yet</p>
                    <p className="text-slate-500 text-sm mt-1">Add skills you want to master</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-gradient-to-br from-gray-800/70 via-slate-800/60 to-gray-900/70 backdrop-blur-xl rounded-2xl border border-emerald-500/25 p-6 shadow-xl text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-teal-500/3 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              
              <div className="py-16 relative z-10">
                <div className="w-24 h-24 bg-gradient-to-r from-emerald-400/15 via-teal-500/12 to-green-600/8 rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/25 via-teal-500/15 to-green-600/25 rounded-full animate-ping"></div>
                  <svg className="w-12 h-12 text-emerald-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                
                <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 bg-clip-text text-transparent mb-4">Activity Timeline</h3>
                <p className="text-slate-300 text-lg mb-4 leading-relaxed">
                  Your learning journey and achievements will appear here
                </p>
                <p className="text-slate-400 mb-8">
                  Start connecting with others and building your skill portfolio
                </p>
                
                <button className="px-10 py-3 bg-gradient-to-r from-emerald-400 via-teal-500 to-green-600 hover:from-emerald-500 hover:via-teal-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/30 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                  <span className="relative z-10 flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Start Your Journey</span>
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Enhanced Edit Profile Modal */}
          {isEditing && (
            <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-gradient-to-br from-gray-800/90 via-slate-800/85 to-gray-900/90 backdrop-blur-xl rounded-2xl border border-emerald-500/25 p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-xl shadow-emerald-500/15 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/3 via-green-500/2 to-teal-500/3 rounded-2xl"></div>
                
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">Edit Profile</h3>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/40 rounded-xl transition-all duration-300 hover:rotate-90 hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="relative z-10">
                  <EditProfile
                    form={form}
                    setForm={setForm}
                    onSubmit={handleSubmit}
                    loading={loading}
                    theme="dark"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}