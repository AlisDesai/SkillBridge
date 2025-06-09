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
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">
        Your Teachable Skills
      </h2>

      <div className="bg-gray-800 p-6 rounded-2xl shadow max-w-2xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Add new skill..."
            className="flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-400 bg-gray-900 text-white"
            value={teachSkill}
            onChange={(e) => setTeachSkill(e.target.value)}
          />
          <select
            value={teachLevel}
            onChange={(e) => setTeachLevel(e.target.value)}
            className="px-4 py-2 border rounded-xl bg-gray-900 text-white focus:ring-2 focus:ring-emerald-400"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
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

      {/* Learnable Skills Section */}
      <div className="space-y-6 mt-10">
        <h2 className="text-2xl font-semibold text-white">
          Skills You Want to Learn
        </h2>

        <div className="bg-gray-800 p-6 rounded-2xl shadow max-w-2xl space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <input
              type="text"
              placeholder="Add new skill to learn..."
              className="flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-teal-400 bg-gray-900 text-white"
              value={learnSkill}
              onChange={(e) => setLearnSkill(e.target.value)}
            />
            <select
              value={learnLevel}
              onChange={(e) => setLearnLevel(e.target.value)}
              className="px-4 py-2 border rounded-xl bg-gray-900 text-white focus:ring-2 focus:ring-teal-400"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <button
              onClick={addLearnSkill}
              disabled={learnLoading}
              className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700"
            >
              {learnLoading ? "Adding..." : "Add"}
            </button>
          </div>

          <SkillList
            skills={learnSkills}
            editable={true}
            onRemove={removeLearnSkill}
          />
        </div>
      </div>
    </div>
  );
}
