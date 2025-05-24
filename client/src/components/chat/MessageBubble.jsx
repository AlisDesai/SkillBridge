export default function MessageBubble({ from, text }) {
  const isMe = from === "me";

  return (
    <div
      className={`max-w-[75%] px-4 py-2 text-sm rounded-xl ${
        isMe ? "ml-auto bg-[#4A6FFF] text-white" : "bg-[#F3F4F6] text-gray-800"
      }`}
    >
      {text}
    </div>
  );
}
