export const getAvatarColors = (id: string) => {
  const colors = [
    "bg-blue-200 text-blue-700 border-blue-400",
    "bg-purple-200 text-purple-700 border-purple-400",
    "bg-pink-200 text-pink-700 border-pink-400",
    "bg-green-200 text-green-700 border-green-400",
    "bg-orange-200 text-orange-700 border-orange-400",
    "bg-cyan-200 text-cyan-700 border-cyan-400",
  ];

  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};
