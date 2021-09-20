import UserAvatar from "./UserAvatar";
import ConnectionsList from "./ConnectionsList";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import * as types from "../utilities/types";
import { ProfileQuery, saveProfile } from "../services/content";
import { core } from "@dsnp/sdk";
import GraphChangeButton from "./GraphChangeButton";
import ProfileEditButtons from "./ProfileEditButtons";

const Profile = (): JSX.Element => {
  const userId: string | undefined = useAppSelector((state) => state.user.id);

  const followedByCurrentuser = useAppSelector(
    (state) => (userId && state.graphs.following[userId]) || {}
  );

  const displayId: string | undefined = useAppSelector(
    (state) => state.user.displayId
  );

  const profiles: Record<types.HexString, types.User> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );

  const user: types.User | undefined = displayId
    ? profiles[displayId]
    : undefined;

  const { data: profile } = ProfileQuery(user);

  const handle = user?.handle;
  const [newName, setNewName] = useState<string | undefined>();
  const [didEditProfile, setDidEditProfile] = useState<boolean>(false);

  const profileName = profile?.name || "Anonymous";

  useEffect(() => {
    if (newName && newName !== profileName) {
      setDidEditProfile(true);
      return;
    }
    setDidEditProfile(false);
  }, [newName, profileName, handle]);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const getClassName = (sectionName: string) => {
    return isEditing
      ? `ProfileBlock__${sectionName} ProfileBlock__editing`
      : `ProfileBlock__${sectionName}`;
  };

  const saveEditProfile = async () => {
    setIsEditing(!isEditing);
    if (userId === undefined || newName === undefined) return;
    const newProfile = core.activityContent.createProfile({
      name: newName,
      icon: profile?.icon,
    });
    await saveProfile(BigInt(userId), newProfile);
  };

  const cancelEditProfile = () => {
    setIsEditing(!isEditing);
    setNewName(undefined);
  };

  return (
    <>
      <div className="ProfileBlock__personalInfoBlock">
        <div className="ProfileBlock__avatarBlock">
          <UserAvatar user={user} avatarSize="large" />
          {userId === displayId && (
            <ProfileEditButtons
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              saveEditProfile={saveEditProfile}
              didEditProfile={didEditProfile}
              cancelEditProfile={cancelEditProfile}
            />
          )}
          {userId && userId !== displayId && user && (
            <GraphChangeButton
              userId={userId}
              user={user}
              following={followedByCurrentuser}
            />
          )}
        </div>
        <div className="ProfileBlock__personalInfo">
          <label className="ProfileBlock__personalInfoLabel">NAME</label>
          <input
            className={getClassName("name")}
            value={newName || newName === "" ? newName : profileName}
            onChange={(e) => setNewName(e.target.value)}
            disabled={!isEditing}
          />

          <div className="ProfileBlock__personalInfoLabel">HANDLE</div>
          <div className="ProfileBlock__handle">@{handle}</div>

          <div className="ProfileBlock__personalInfoLabel">SOCIAL ADDRESS</div>
          <div className="ProfileBlock__dsnpUserId">
            {displayId || "Anonymous"}
          </div>
        </div>
      </div>
      <ConnectionsList />
    </>
  );
};

export default Profile;
