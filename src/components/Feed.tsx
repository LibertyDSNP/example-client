import React from "react";
import MetamaskInstructions from "./MetamaskInstructions";

const Feed = (): JSX.Element => {
  return (
    <div className="Feed__block">
      <div className="Feed__content">
        <h1>Feed</h1>
      </div>
      <MetamaskInstructions />
    </div>
  );
};
export default Feed;
