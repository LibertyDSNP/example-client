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

const getRelativeTime = (postTime: string) => {
  const timeOfPost = new Date(postTime);
  const currentTime = new Date();
  const secondsPast = (currentTime.getTime() - timeOfPost.getTime()) / 1000;
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
    return `${getMonthName(timeOfPost.getMonth())} ${
      timeOfPost.getDate() + 1
    }, ${timeOfPost.getFullYear()} •`;
  }
};

interface RelativeTimeProps {
  published: string;
  postStyle: boolean;
}

const RelativeTime = ({
  published,
  postStyle,
}: RelativeTimeProps): JSX.Element => {
  return (
    <p className={`RelativeTime ${postStyle ? "RelativeTime--post" : ""}`}>
      {getRelativeTime(published)}
    </p>
  );
};

export default RelativeTime;
