import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearReviews } from "../redux/slices/reviewSlice";
import ReviewList from "../components/reviews/ReviewList";
import api from "../utils/api";

export default function UserReviewsPage() {
 const location = useLocation();
 const navigate = useNavigate();
 const { userId } = useParams();
 const dispatch = useDispatch();

 const [user, setUser] = useState(null);
 const [loading, setLoading] = useState(true);

 const targetUserId = location.state?.userId || userId;

 useEffect(() => {
   if (!targetUserId) {
     navigate("/dashboard");
     return;
   }

   dispatch(clearReviews());

   const fetchUser = async () => {
     try {
       const response = await api.get(`/users/${targetUserId}`);
       setUser(response.data);
     } catch (err) {
       console.error("Failed to fetch user:", err);
       navigate("/dashboard");
     } finally {
       setLoading(false);
     }
   };

   fetchUser();
 }, [targetUserId, navigate, dispatch]);

 if (loading) {
   return (
     <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-950 relative overflow-hidden">
       <div className="fixed inset-0 overflow-hidden pointer-events-none">
         <div className="absolute -top-96 -right-96 w-[800px] h-[800px] bg-gradient-to-br from-emerald-400/5 via-green-500/3 to-teal-600/2 rounded-full blur-3xl animate-pulse"></div>
         <div className="absolute -bottom-96 -left-96 w-[800px] h-[800px] bg-gradient-to-tr from-green-400/4 via-teal-500/3 to-emerald-600/2 rounded-full blur-3xl animate-pulse delay-1000"></div>
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-teal-400/3 via-emerald-500/2 to-green-600/2 rounded-full blur-2xl animate-pulse delay-500"></div>
       </div>

       <div className="relative z-10 flex justify-center items-center h-screen">
         <div className="flex flex-col items-center space-y-6">
           <div className="relative">
             <div className="w-16 h-16 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
             <div className="absolute inset-0 w-16 h-16 border-4 border-teal-400/20 border-b-teal-400 rounded-full animate-spin animate-reverse" style={{animationDuration: '1.5s'}}></div>
           </div>
           <div className="text-center">
             <div className="text-emerald-400 text-lg font-semibold mb-2">Loading Reviews</div>
             <div className="text-slate-400 text-sm">Gathering user feedback and testimonials...</div>
           </div>
         </div>
       </div>
     </div>
   );
 }

 if (!user) {
   return (
     <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-950 relative overflow-hidden">
       <div className="fixed inset-0 overflow-hidden pointer-events-none">
         <div className="absolute -top-96 -right-96 w-[800px] h-[800px] bg-gradient-to-br from-red-400/5 via-orange-500/3 to-red-600/2 rounded-full blur-3xl animate-pulse"></div>
         <div className="absolute -bottom-96 -left-96 w-[800px] h-[800px] bg-gradient-to-tr from-orange-400/4 via-red-500/3 to-orange-600/2 rounded-full blur-3xl animate-pulse delay-1000"></div>
       </div>

       <div className="relative z-10 flex justify-center items-center h-screen">
         <div className="text-center">
           <div className="w-24 h-24 bg-gradient-to-r from-red-500/15 to-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-orange-500/8 to-red-500/5 animate-pulse rounded-2xl"></div>
             <svg className="w-12 h-12 text-red-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
             </svg>
           </div>
           <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300 bg-clip-text text-transparent mb-3">
             User Not Found
           </h2>
           <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
             The requested user profile could not be located. Please verify the user ID and try again.
           </p>
         </div>
       </div>
     </div>
   );
 }

 return (
   <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-950 relative overflow-hidden">
     {/* Enhanced Background Effects */}
     <div className="fixed inset-0 overflow-hidden pointer-events-none">
       <div className="absolute -top-96 -right-96 w-[800px] h-[800px] bg-gradient-to-br from-emerald-400/6 via-green-500/4 to-teal-600/3 rounded-full blur-3xl animate-pulse"></div>
       <div className="absolute -bottom-96 -left-96 w-[800px] h-[800px] bg-gradient-to-tr from-green-400/5 via-teal-500/4 to-emerald-600/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-teal-400/4 via-emerald-500/3 to-green-600/3 rounded-full blur-2xl animate-pulse delay-500"></div>
       
       {/* Additional accent orbs */}
       <div className="absolute top-20 right-32 w-[300px] h-[300px] bg-gradient-to-bl from-emerald-300/4 via-green-400/3 to-teal-400/2 rounded-full blur-2xl animate-pulse delay-2000"></div>
       <div className="absolute bottom-32 left-32 w-[200px] h-[200px] bg-gradient-to-tr from-green-300/3 via-emerald-400/2 to-teal-300/2 rounded-full blur-xl animate-pulse delay-3000"></div>

       {/* Enhanced floating particles */}
       {[...Array(12)].map((_, i) => (
         <div
           key={i}
           className="absolute w-2 h-2 rounded-full animate-ping opacity-25"
           style={{
             background: `radial-gradient(circle, 
               ${i % 4 === 0 ? 'rgba(52, 211, 153, 0.5)' : 
                 i % 4 === 1 ? 'rgba(34, 197, 94, 0.5)' : 
                 i % 4 === 2 ? 'rgba(20, 184, 166, 0.5)' :
                 'rgba(16, 185, 129, 0.5)'}
               , transparent 70%)`,
             top: `${15 + (i * 6)}%`,
             left: `${8 + (i * 7)}%`,
             animationDelay: `${i * 0.8}s`,
             animationDuration: '4s'
           }}
         />
       ))}

       {/* Enhanced grid pattern */}
       <div className="absolute inset-0 opacity-[0.015]" style={{
         backgroundImage: `
           radial-gradient(circle at 1px 1px, rgba(52, 211, 153, 0.15) 1px, transparent 0)
         `,
         backgroundSize: '40px 40px'
       }}></div>
     </div>

     <div className="relative z-10 p-6 lg:p-8">
       <div className="max-w-5xl mx-auto space-y-8">
         {/* Enhanced User Profile Header */}
         <div className="bg-gradient-to-br from-gray-800/80 via-slate-800/70 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-emerald-500/30 p-8 relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-green-500/4 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl"></div>
           
           {/* Decorative elements */}
           <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-emerald-400/10 to-teal-500/5 rounded-full blur-xl"></div>
           <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-tr from-green-400/8 to-emerald-500/4 rounded-full blur-lg"></div>

           <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 relative z-10">
             <div className="relative group">
               <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-2xl flex items-center justify-center text-slate-950 text-3xl font-bold relative overflow-hidden group-hover:scale-105 transition-all duration-500">
                 <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-black/20 to-black/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                 <span className="relative z-10 drop-shadow-lg">
                   {user.name?.charAt(0)?.toUpperCase() || "U"}
                 </span>
                 
                 {/* Animated rings */}
                 <div className="absolute inset-0 rounded-2xl border-2 border-black/8 animate-spin" style={{animationDuration: '10s'}}></div>
                 <div className="absolute inset-2 rounded-2xl border border-black/5 animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}></div>
               </div>
               
               {/* Enhanced glow effect */}
               <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/20 via-green-500/20 to-teal-600/20 blur-xl -z-10 animate-pulse"></div>
             </div>

             <div className="flex-1 text-center lg:text-left">
               <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-50 via-slate-200 to-slate-300 bg-clip-text text-transparent mb-3 leading-tight">
                 Reviews for {user.name}
               </h1>
               <p className="text-slate-300 text-lg leading-relaxed mb-6 max-w-2xl">
                 Discover authentic feedback and testimonials from community members who have experienced {user.name}'s expertise firsthand
               </p>

               {/* Enhanced stats badges */}
               <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                 <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-green-500/15 rounded-xl border border-emerald-500/30 backdrop-blur-sm group hover:scale-105 transition-all duration-300">
                   <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-lg flex items-center justify-center">
                     <svg className="w-4 h-4 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                     </svg>
                   </div>
                   <div>
                     <div className="text-emerald-300 font-medium text-sm">Verified Reviews</div>
                     <div className="text-emerald-400/80 text-xs">Authentic Feedback</div>
                   </div>
                 </div>

                 <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-500/20 to-emerald-500/15 rounded-xl border border-teal-500/30 backdrop-blur-sm group hover:scale-105 transition-all duration-300">
                   <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center">
                     <svg className="w-4 h-4 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                     </svg>
                   </div>
                   <div>
                     <div className="text-teal-300 font-medium text-sm">Community Member</div>
                     <div className="text-teal-400/80 text-xs">Trusted Profile</div>
                   </div>
                 </div>

                 <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-teal-500/15 rounded-xl border border-green-500/30 backdrop-blur-sm group hover:scale-105 transition-all duration-300">
                   <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-teal-500 rounded-lg flex items-center justify-center">
                     <svg className="w-4 h-4 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                   </div>
                   <div>
                     <div className="text-green-300 font-medium text-sm">Active Status</div>
                     <div className="text-green-400/80 text-xs">Currently Available</div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>

         {/* Enhanced Reviews Section */}
         <div className="bg-gradient-to-br from-gray-800/80 via-slate-800/70 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-green-500/30 relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-teal-500/4 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl"></div>
           
           {/* Decorative header pattern */}
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"></div>

           {/* Enhanced Header */}
           <div className="p-6 border-b border-slate-700/40 relative z-10">
             <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
               <div className="flex items-center space-x-3">
                 <div className="relative">
                   <div className="w-10 h-10 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-xl flex items-center justify-center relative overflow-hidden">
                     <svg className="w-5 h-5 text-slate-950 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                     </svg>
                     <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-black/10 to-black/0 animate-pulse"></div>
                   </div>
                   <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/30 to-teal-500/30 blur-lg -z-10"></div>
                 </div>
                 <div>
                   <h2 className="text-2xl font-bold bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
                     Community Reviews & Testimonials
                   </h2>
                   <p className="text-slate-400 mt-1 text-sm">Real experiences shared by verified members</p>
                 </div>
               </div>

               <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500/15 to-emerald-500/10 rounded-xl border border-green-500/25 backdrop-blur-sm">
                 <div className="relative">
                   <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                   <div className="absolute inset-0 w-2 h-2 bg-green-400/50 rounded-full animate-ping"></div>
                 </div>
                 <span className="text-green-300 font-medium text-sm">Live Feedback</span>
               </div>
             </div>
           </div>

           {/* Reviews Content with enhanced styling */}
           <div className="p-6 relative z-10">
             <div className="relative">
               {/* Content background enhancement */}
               <div className="absolute inset-0 bg-gradient-to-b from-slate-800/20 via-transparent to-slate-800/20 rounded-xl"></div>
               
               <ReviewList
                 userId={targetUserId}
                 showActions={false}
                 showTitle={false}
                 limit={10}
               />
             </div>
           </div>
         </div>
       </div>
     </div>

     {/* Enhanced CSS Animations */}
     <style jsx>{`
       @keyframes fadeInUp {
         from {
           opacity: 0;
           transform: translateY(30px);
         }
         to {
           opacity: 1;
           transform: translateY(0);
         }
       }
       
       @keyframes float {
         0%, 100% { transform: translateY(0px); }
         50% { transform: translateY(-10px); }
       }
       
       @keyframes shimmer {
         0% { transform: translateX(-100%); }
         100% { transform: translateX(100%); }
       }
       
       .animate-fadeInUp {
         animation: fadeInUp 0.8s ease-out forwards;
       }
       
       .animate-float {
         animation: float 6s ease-in-out infinite;
       }
       
       .animate-reverse {
         animation-direction: reverse;
       }
     `}</style>
   </div>
 );
}