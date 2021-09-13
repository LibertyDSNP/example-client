import React from "react";
import { ProfileQuery } from "../services/content";
import { userIdentification } from "../services/utilities";
import { User } from "../utilities/types";

/**
 * Component that simplifies displaying a user's name when the profile is not already available.
 * @param user state user representation that contains DSNP id and possibly handle
 * @returns best identifier for the user
 */
export const UserName = ({ user }: { user: User }): JSX.Element => {
  const { data: profile } = ProfileQuery(user);
  return <>{userIdentification(user, profile)}</>;
};
