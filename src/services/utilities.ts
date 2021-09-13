import { ActivityContentProfile } from "@dsnp/sdk/core/activityContent";
import { User } from "../utilities/types";

export const isFunction = (o: unknown): boolean => typeof o == "function";
export const isUint8Array = (o: unknown): boolean =>
  typeof o == "object" && (o as any).constructor === Uint8Array;

/**
 * userIdentification constructs the most descriptive name from the user information
 * availble. This is the user's profile name, then handle, then DSNP id.
 * @param userInfo announcment information with id and possibly handle.
 * @param profile user profile contianing name.
 * @returns a string used to identify the user
 */
export const userIdentification = (
  user: User | undefined,
  profile: ActivityContentProfile | undefined
): string => {
  return (
    profile?.name || (user?.handle && `@${user?.handle}`) || user?.fromId || ""
  );
};
