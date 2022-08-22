import { days } from "../constants/Days";
import { months } from "../constants/Months";

export const formatDateTime = (dateTime?: Date) => {
  if (dateTime) {
    const tzoffset = dateTime.getTimezoneOffset() * 60000; //offset in milliseconds
    const localISOTime = new Date(dateTime.getTime() - tzoffset).toISOString();

    return localISOTime;
  }
};

export const formatTime = (dateTime?: Date) => {
  if (dateTime) {
    let hours = dateTime.getUTCHours() - 7;
    let minutes = dateTime.getUTCMinutes();
    let period = "AM";

    if (hours < 0) {
      hours = 24 + hours - 12;
      period = "PM";
    } else if (hours > 12) {
      hours = hours - 12;
      period = "PM";
    } else if (hours === 0) {
      hours = 12;
    }

    return `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${period}`;
  }
};

export const formatDate = (dateTime?: Date) => {
  if (dateTime) {
    const day = days[dateTime.getDay()];
    const date = dateTime.getDate();
    const month = months[dateTime.getMonth()];

    return `${day}, ${month} ${date}`;
  }
};

export const dayHasPassed = (oldMessageDateTime?: string) => {
  if (oldMessageDateTime) {
    if (new Date(oldMessageDateTime).getDate() !== new Date().getDate()) {
      return true;
    }
  }

  return false;
};
