import React from "react";

const getMonthName = (monthNum: number) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[monthNum];
};

const getRelativeTime = (timestamp: number) => {
  const currentTime = new Date();
  const postTime = new Date(timestamp * 1000);
  const secondsPast = (currentTime.getTime() - postTime.getTime()) / 1000;
  if (secondsPast < 60) {
    return Math.floor(secondsPast) + "s •";
  }
  if (secondsPast < 3600) {
    return Math.floor(secondsPast / 60) + "m •";
  }
  if (secondsPast <= 86400) {
    return Math.floor(secondsPast / 3600) + "h •";
  }
  if (secondsPast > 86400) {
    const day = postTime.getDate();
    const month = getMonthName(postTime.getMonth());
    const year =
      postTime.getFullYear() === currentTime.getFullYear()
        ? ""
        : `, ${postTime.getFullYear()}`;
    return `${month} ${day}${year} •`;
  }
};

interface RelativeTimeProps {
  timestamp: number;
  postStyle: boolean;
}

const RelativeTime = ({
  timestamp,
  postStyle,
}: RelativeTimeProps): JSX.Element => {
  return (
    <p className={`RelativeTime ${postStyle ? "RelativeTime--post" : ""}`}>
      {getRelativeTime(timestamp)}
    </p>
  );
};

export default RelativeTime;
