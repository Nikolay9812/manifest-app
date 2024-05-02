export const formatTimeForInput = (timeString) => {
    const date = new Date(timeString); // Convert the ISO string to a Date object
    const hours = String(date.getHours()).padStart(2, '0'); // Get hours and pad with leading zero if necessary
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Get minutes and pad with leading zero if necessary
    return `${hours}:${minutes}`;
};
  
export const formatTime = (timeString) => {
  if (!timeString) {
    return null;
  }
  // Assuming timeString is in "HH:mm" format
  const [hours, minutes] = timeString.split(':');
  return new Date(0, 0, 0, hours, minutes); // Create a Date object with today's date and specified time
};

export const formatHours = (hours) => {
  const totalMinutes = hours * 60;
  const hoursPart = Math.floor(totalMinutes / 60);
  const minutesPart = Math.round(totalMinutes % 60);
  return `${padZero(hoursPart)}:${padZero(minutesPart)}`;
};

const padZero = (num) => {
  return num.toString().padStart(2, '0');
};