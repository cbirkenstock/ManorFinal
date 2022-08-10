import { days } from "../constants/Days";
import { months } from "../constants/Months";

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
