export const formatTimeWithUTC = (
  timestamp: number,
  timezoneOffsetMinutes: number
) => {
  const date = new Date(timestamp);

  const localTime = new Date(
    date.getTime() - timezoneOffsetMinutes * 60 * 1000
  );

  const time = localTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const utcOffset = timezoneOffsetMinutes / -60;
  const sign = utcOffset >= 0 ? "+" : "";

  return `${time} (UTC${sign}${utcOffset})`;
}
