export default function SkillList({ skills = [], editable = false, onRemove }) {
  if (!skills.length) {
    return <p className="text-gray-400">No skills added yet.</p>;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {skills.map((skill, index) => (
        <span
          key={index}
          className="bg-[#E5E7EB] text-gray-700 px-3 py-1 rounded-full flex items-center gap-2"
        >
          <span className="font-medium">{skill.name}</span>
          <span className="text-xs text-gray-600">({skill.level})</span>
          {editable && (
            <button
              type="button"
              onClick={() => onRemove?.(skill.name)}
              className="text-red-500 text-sm hover:text-red-600"
            >
              ×
            </button>
          )}
        </span>
      ))}
    </div>
  );
}
