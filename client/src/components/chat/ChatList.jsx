const chats = [
  { name: "Anika Sharma", lastMessage: "Let’s start at 4?", time: "2h ago" },
  { name: "Rahul Verma", lastMessage: "Session confirmed!", time: "Yesterday" },
];

export default function ChatList({ onSelect }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 h-full overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Messages</h3>
      <ul className="space-y-3">
        {chats.map((chat, index) => (
          <li
            key={index}
            onClick={() => onSelect(chat)}
            className="flex justify-between items-center cursor-pointer hover:bg-[#F3F4F6] px-4 py-3 rounded-xl transition"
          >
            <div>
              <p className="font-medium text-gray-700">{chat.name}</p>
              <p className="text-sm text-gray-500">{chat.lastMessage}</p>
            </div>
            <span className="text-xs text-gray-400">{chat.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
