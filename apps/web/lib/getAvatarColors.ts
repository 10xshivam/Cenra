export const getAvatarColors = (name: string) => {
  const colors = [
    "bg-blue-200 text-blue-700 border-blue-400",
    "bg-purple-200 text-purple-700 border-purple-400",
    "bg-pink-200 text-pink-700 border-pink-400",
    "bg-green-200 text-green-700 border-green-400",
    "bg-orange-200 text-orange-700 border-orange-400",
    "bg-cyan-200 text-cyan-700 border-cyan-400",
    "bg-red-200 text-red-700 border-red-400",
    "bg-yellow-200 text-yellow-700 border-yellow-400",
    "bg-indigo-200 text-indigo-700 border-indigo-400",
    "bg-violet-200 text-violet-700 border-violet-400",
    "bg-fuchsia-200 text-fuchsia-700 border-fuchsia-400",
    "bg-rose-200 text-rose-700 border-rose-400",
    "bg-sky-200 text-sky-700 border-sky-400",
    "bg-teal-200 text-teal-700 border-teal-400",
    "bg-emerald-200 text-emerald-700 border-emerald-400",
    "bg-lime-200 text-lime-700 border-lime-400",
    "bg-amber-200 text-amber-700 border-amber-400",
    "bg-slate-200 text-slate-700 border-slate-400",
    "bg-zinc-200 text-zinc-700 border-zinc-400",
    "bg-stone-200 text-stone-700 border-stone-400",
  ];

  const hash = name
    .split("")
    .reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 1), 0);
  return colors[hash % colors.length];
};
