export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
}) {
  const baseStyles = "px-5 py-2 rounded-xl font-medium transition duration-200";
  const variants = {
    primary: "bg-[#4A6FFF] text-white hover:bg-[#3b5dfc]",
    secondary: "bg-[#34D399] text-white hover:bg-[#2dbb8b]",
    danger: "bg-[#EF4444] text-white hover:bg-red-600",
    outline: "border border-[#4A6FFF] text-[#4A6FFF] hover:bg-[#EEF2FF]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || ""} ${className}`}
    >
      {children}
    </button>
  );
}
