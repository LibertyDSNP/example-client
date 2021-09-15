import React from "react";
import { Button, Spin } from "antd";
import { useAppDispatch } from "../redux/hooks";
import {
  RelationshipState,
  RelationshipStatus,
  updateRelationshipStatus,
} from "../redux/slices/graphSlice";
import { followUser, unfollowUser } from "../services/content";
import { User } from "../utilities/types";

interface FollowButtonProps {
  userId: string;
  user: User;
  following: Record<string, RelationshipState>;
}

const GraphChangeButton = ({
  userId,
  user: profile,
  following,
}: FollowButtonProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const isFollowing = (profile: User): boolean =>
    [RelationshipStatus.FOLLOWING, RelationshipStatus.UPDATING].includes(
      following[profile.fromId]?.status
    );

  const isFollowingUpdating = (profile: User): boolean =>
    following[profile.fromId]?.status === RelationshipStatus.UPDATING;

  const buttonText = (profile: User): string =>
    isFollowingUpdating(profile)
      ? "updating"
      : isFollowing(profile)
      ? "Unfollow"
      : "Follow";

  const changeGraphState = async (profile: User) => {
    if (isFollowing(profile)) {
      await unfollowUser(BigInt(userId), BigInt(profile.fromId));
    } else {
      await followUser(BigInt(userId), BigInt(profile.fromId));
    }
    dispatch(
      updateRelationshipStatus({
        follower: userId,
        followee: profile.fromId,
        status: RelationshipStatus.UPDATING,
      })
    );
  };

  return (
    <Button
      className="GraphChangeButton"
      name={buttonText(profile)}
      onClick={() => changeGraphState(profile)}
      disabled={isFollowingUpdating(profile)}
    >
      {buttonText(profile)}
      {isFollowingUpdating(profile) ? (
        <Spin></Spin>
      ) : (
        <div
          className={
            buttonText(profile) === "Follow"
              ? "GraphChangeButton__followIcon"
              : "GraphChangeButton__unfollowIcon"
          }
        >
          &#10005;
        </div>
      )}
    </Button>
  );
};
export default GraphChangeButton;
