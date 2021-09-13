import React from "react";
import { Button } from "antd";

interface LogoutProps {
  logout: () => void;
}

const Logout = ({ logout }: LogoutProps): JSX.Element => {
  return (
    <Button
      className="Logout__logoutButton"
      aria-label="Logout"
      onClick={logout}
    >
      Sign Out
    </Button>
  );
};

export default Logout;
