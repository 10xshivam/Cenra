export const formatTime = (isoDate: string) => {
  const then = new Date(isoDate).getTime();
  const now = Date.now();
  const diffMs = now - then;

  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  return `${days}d`;
};