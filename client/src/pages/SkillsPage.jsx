import { useState, useEffect } from "react";
import api from "../utils/api";
import { useSelector } from "react-redux";
import { showSuccess, showError } from "../utils/toast";

export default function SkillsPage() {
  const { user } = useSelector((state) => state.auth);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get("/skills/my-skills");
        setSkills(res.data.skills || []);
      } catch (err) {
        showError("Failed to load skills");
      }
    };

    if (user) fetchSkills();
  }, [user]);

  const addSkill = async () => {
    if (!newSkill || skills.includes(newSkill)) return;

    try {
      const res = await api.post("/skills/add", { name: newSkill });
      setSkills([...skills, res.data.name]);
      showSuccess("Skill added");
      setNewSkill("");
    } catch (err) {
      showError(err.response?.data?.message || "Error adding skill");
    }
  };

  const removeSkill = async (skill) => {
    try {
      await api.delete(`/skills/remove`, { data: { name: skill } });
      setSkills(skills.filter((s) => s !== skill));
      showSuccess("Skill removed");
    } catch (err) {
      showError("Failed to remove skill");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Manage Skills</h2>
      <div className="bg-white p-6 rounded-2xl shadow max-w-2xl space-y-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Add new skill..."
            className="flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#34D399]"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
          <button
            onClick={addSkill}
            disabled={loading}
            className="px-4 py-2 bg-[#34D399] text-white rounded-xl hover:bg-[#2dbb8b]"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="bg-[#E5E7EB] text-gray-700 px-3 py-1 rounded-full flex items-center gap-2"
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
