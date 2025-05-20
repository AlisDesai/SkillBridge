import { useState, useEffect } from "react";
import api from "../utils/api";
import { showSuccess, showError } from "../utils/toast";

export default function SchedulePage() {
  const [slots, setSlots] = useState([]);
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");

  const fetchSlots = async () => {
    try {
      const res = await api.get("/schedule");
      setSlots(res.data || []);
    } catch {
      showError("Failed to load schedule");
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const addSlot = async () => {
    if (!day || !time) return;

    try {
      const res = await api.post("/schedule", { day, time });
      setSlots([...slots, res.data]);
      showSuccess("Slot added");
      setDay("");
      setTime("");
    } catch {
      showError("Failed to add slot");
    }
  };

  const removeSlot = async (id) => {
    try {
      await api.delete(`/schedule/${id}`);
      setSlots(slots.filter((slot) => slot._id !== id));
      showSuccess("Slot removed");
    } catch {
      showError("Failed to remove slot");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-semibold text-gray-800">Schedule</h2>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Day"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="px-4 py-2 border rounded-xl w-full sm:w-auto flex-1 focus:ring-2 focus:ring-[#4A6FFF]"
          />
          <input
            type="text"
            placeholder="Time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="px-4 py-2 border rounded-xl w-full sm:w-auto flex-1 focus:ring-2 focus:ring-[#4A6FFF]"
          />
          <button
            onClick={addSlot}
            className="bg-[#4A6FFF] text-white px-6 py-2 rounded-xl hover:bg-[#3b5dfc] transition"
          >
            Add
          </button>
        </div>

        <div className="space-y-3 mt-4">
          {slots.map((slot) => (
            <div
              key={slot._id}
              className="flex justify-between items-center bg-[#F9FAFB] px-4 py-3 rounded-xl"
            >
              <p className="text-gray-700">
                {slot.day} — <span className="text-gray-500">{slot.time}</span>
              </p>
              <button
                className="text-sm text-red-500 hover:underline"
                onClick={() => removeSlot(slot._id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
