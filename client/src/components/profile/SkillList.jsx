import React from "react";

export default function SkillList({ skills = [], editable = false, onRemove }) {
  if (!skills.length) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-gradient-to-r from-slate-600/20 to-gray-600/15 rounded-xl flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <p className="text-slate-400 font-medium">No skills added yet</p>
        <p className="text-slate-500 text-sm mt-1">Start building your skill profile</p>
      </div>
    );
  }

  const getLevelConfig = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return {
          gradient: 'from-blue-500/15 via-indigo-500/10 to-purple-500/5',
          border: 'border-blue-400/30',
          textColor: 'text-blue-300',
          levelBg: 'bg-blue-400/20',
          levelText: 'text-blue-200',
          icon: '🌱',
          glow: 'hover:shadow-blue-500/20'
        };
      case 'intermediate':
        return {
          gradient: 'from-emerald-500/15 via-green-500/10 to-teal-500/5',
          border: 'border-emerald-400/30',
          textColor: 'text-emerald-300',
          levelBg: 'bg-emerald-400/20',
          levelText: 'text-emerald-200',
          icon: '⚡',
          glow: 'hover:shadow-emerald-500/20'
        };
      case 'advanced':
        return {
          gradient: 'from-orange-500/15 via-red-500/10 to-pink-500/5',
          border: 'border-orange-400/30',
          textColor: 'text-orange-300',
          levelBg: 'bg-orange-400/20',
          levelText: 'text-orange-200',
          icon: '🔥',
          glow: 'hover:shadow-orange-500/20'
        };
      default:
        return {
          gradient: 'from-slate-500/15 via-gray-500/10 to-slate-500/5',
          border: 'border-slate-400/30',
          textColor: 'text-slate-300',
          levelBg: 'bg-slate-400/20',
          levelText: 'text-slate-200',
          icon: '💼',
          glow: 'hover:shadow-slate-500/20'
        };
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {skills.map((skill, index) => {
        const config = getLevelConfig(skill.level);
        
        return (
          <div
            key={index}
            className={`
              bg-gradient-to-br ${config.gradient} 
              backdrop-blur-sm rounded-xl border ${config.border}
              p-4 transition-all duration-300 transform hover:scale-105
              ${config.glow} hover:shadow-lg
              relative overflow-hidden group
            `}
          >
            {/* Background shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Header with icon and remove button */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg" role="img" aria-label="skill level">
                    {config.icon}
                  </span>
                  {editable && (
                    <button
                      type="button"
                      onClick={() => onRemove?.(skill.name)}
                      className="ml-auto w-6 h-6 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 hover:border-red-400/50 rounded-lg flex items-center justify-center text-red-300 hover:text-red-200 transition-all duration-200 opacity-0 group-hover:opacity-100"
                      aria-label={`Remove ${skill.name}`}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Skill name */}
              <h3 className={`font-semibold text-lg ${config.textColor} mb-2 leading-tight`}>
                {skill.name}
              </h3>

              {/* Level badge */}
              <div className="flex items-center justify-between">
                <span className={`
                  px-3 py-1 ${config.levelBg} ${config.levelText} 
                  rounded-lg text-xs font-medium border border-white/10
                  backdrop-blur-sm
                `}>
                  {skill.level}
                </span>
                
                {/* Skill strength indicator */}
                <div className="flex space-x-1">
                  {[1, 2, 3].map((dot) => (
                    <div
                      key={dot}
                      className={`
                        w-2 h-2 rounded-full transition-all duration-300
                        ${dot <= (skill.level === 'Advanced' ? 3 : skill.level === 'Intermediate' ? 2 : 1)
                          ? config.textColor.replace('text-', 'bg-').replace('/30', '/60')
                          : 'bg-slate-600/30'
                        }
                      `}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}