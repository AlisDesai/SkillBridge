import { useEffect, useState } from "react";
import api from "../utils/api";
import { showSuccess, showError } from "../utils/toast";
import SkillList from "../components/profile/SkillList";

export default function SkillsPage() {
  const [newSkill, setNewSkill] = useState("");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSkills = async () => {
    try {
      const res = await api.get("/users/me");
      const userSkills = res.data?.teachSkills?.map((s) => s.name) || [];
      setSkills(userSkills);
    } catch {
      showError("Failed to load skills");
    }
  };

  const addSkill = async () => {
    if (!newSkill) return;
    setLoading(true);
    try {
      await api.post("/skills/teach", {
        name: newSkill,
        level: "Beginner",
      });
      showSuccess("Skill added");
      setNewSkill("");
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
      setSkills((prev) => prev.filter((s) => s !== name));
    } catch {
      showError("Failed to remove skill");
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">
        Your Teachable Skills
      </h2>

      <div className="bg-gray-800 p-6 rounded-2xl shadow max-w-2xl space-y-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Add new skill..."
            className="flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-400 bg-gray-900 text-white"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
          <button
            onClick={addSkill}
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>

        <SkillList skills={skills} editable={true} onRemove={removeSkill} />
      </div>
    </div>
  );
}
