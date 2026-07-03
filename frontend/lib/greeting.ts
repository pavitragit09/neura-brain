export function getTimeOfDayGreeting(date = new Date()) {
  const hour = date.getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

export function getFirstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}
