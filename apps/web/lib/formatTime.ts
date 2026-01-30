export const handleTimeSince = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes <= 0) {
    return "Up-to-date (now)";
  }

  if (diffMinutes < 60) {
    return `Up-to-date (${diffMinutes}m)`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `Up-to-date (${diffHours}h)`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `Up-to-date (${diffDays}d)`;
};

export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  if (Number.isNaN(date.getTime())) {
    return "now";
  }

  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes <= 0) {
    return "now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h`;
  }

  const formatted = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
  }).format(date);

  return formatted;
};

export const formatExpiryTime = (expiresAt: string) => {
  if (!expiresAt) return "Expires in —";

  const now = Date.now();
  const expires = new Date(expiresAt).getTime();
  if (Number.isNaN(expires)) return "Expires in —";

  const diffMs = expires - now;
  if (diffMs <= 0) return "Expired";

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days >= 1) return `Expires in ${days} day${days === 1 ? "" : "s"}`;
  if (hours >= 1) return `Expires in ${hours} hr${hours === 1 ? "" : "s"}`;

  const mins = Math.max(1, minutes);
  return `Expires in ${mins} min${mins === 1 ? "" : "s"}`;
};
