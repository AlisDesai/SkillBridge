import MessageBubble from "./MessageBubble";

const sampleMessages = [
  { from: "me", text: "Hey Anika!" },
  { from: "Anika", text: "Hi! Are we still on for today?" },
  { from: "me", text: "Absolutely, let’s do 4 PM." },
];

export default function ChatWindow() {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow p-4">
      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        {sampleMessages.map((msg, index) => (
          <MessageBubble key={index} from={msg.from} text={msg.text} />
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#4A6FFF]"
        />
        <button className="px-4 py-2 bg-[#4A6FFF] text-white rounded-xl hover:bg-[#3b5dfc] transition">
          Send
        </button>
      </div>
    </div>
  );
}
