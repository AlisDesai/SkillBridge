import { useEffect, useState } from "react";
import api from "../utils/api";
import { showError, showSuccess } from "../utils/toast";

export default function ManageSkills() {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  const fetchSkills = async () => {
    try {
      const res = await api.get("/admin/skills");
      setSkills(res.data || []);
    } catch {
      showError("Failed to load skills");
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const addSkill = async () => {
    if (!newSkill || skills.includes(newSkill)) return;

    try {
      const res = await api.post("/admin/skills", { name: newSkill });
      setSkills([...skills, res.data.name]);
      setNewSkill("");
      showSuccess("Skill added");
    } catch {
      showError("Failed to add skill");
    }
  };

  const removeSkill = async (skill) => {
    try {
      await api.delete(`/admin/skills/${skill}`);
      setSkills(skills.filter((s) => s !== skill));
      showSuccess("Skill removed");
    } catch {
      showError("Failed to remove skill");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-semibold text-gray-800">Manage Skills</h2>
      <div className="bg-white shadow rounded-2xl p-6 space-y-4">
        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="New Skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#FF7A59]"
          />
          <button
            onClick={addSkill}
            className="bg-[#FF7A59] text-white px-6 py-2 rounded-xl hover:bg-[#e76745]"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-[#F3F4F6] text-gray-700 rounded-full flex items-center gap-2"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="text-red-500 text-sm"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
