import React from "react";
import RelativeTime from "./RelativeTime";
import CommentIcon from "../images/CommentIcon.svg";
import LikeIcon from "../images/LikeIcon.svg";
import ConnectIcon from "../images/ConnectIcon.svg";

interface ActionsBarProps {
  published: string;
}

const ActionsBar = ({ published }: ActionsBarProps): JSX.Element => {
  return (
    <div className="ActionsBar__block">
      <RelativeTime published={published} postStyle={true} />
      <div className="ActionsBar__iconList">
        <img src={LikeIcon} alt="like icon" />
        <img src={CommentIcon} alt="comments icon" />
        <img src={ConnectIcon} alt="connect icon" />
      </div>
    </div>
  );
};

export default ActionsBar;
