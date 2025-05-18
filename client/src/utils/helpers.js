export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const truncateText = (text, length = 100) => {
  return text.length > length ? text.slice(0, length) + "..." : text;
};
