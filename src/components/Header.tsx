import React from "react";
import Login from "./Login";

const Header = (): JSX.Element => {
  return (
    <div className="Header__block">
      <h1 className="Header__title">Example Client</h1>
      <Login />
    </div>
  );
};
export default Header;
