// client/src/components/profile/SkillList.jsx
import React from "react"; // Added React import

export default function SkillList({ skills = [], editable = false, onRemove }) {
  if (!skills.length) {
    return <p className="text-gray-400 italic">No skills added yet.</p>;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {skills.map((skill, index) => (
        <span
          key={index}
          className="bg-emerald-700 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-md transition duration-200 hover:scale-105"
        >
          <span className="font-semibold">{skill.name}</span>
          <span className="text-emerald-200">({skill.level})</span>
          {editable && (
            <button
              type="button"
              onClick={() => onRemove?.(skill.name)}
              className="text-red-300 text-lg ml-1 hover:text-red-100 transition-colors"
              aria-label={`Remove ${skill.name}`}
            >
              &times;
            </button>
          )}
        </span>
      ))}
    </div>
  );
}
