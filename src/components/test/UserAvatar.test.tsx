import React from "react";
import { shallow } from "enzyme";
import UserAvatar from "../UserAvatar";
import { getPrefabDsnpUserId } from "../../test/testAddresses";

describe("UserAvatar", () => {
  it("renders without crashing", () => {
    expect(() => {
      shallow(
        <UserAvatar
          profileAddress={getPrefabDsnpUserId(0)?.toString()}
          avatarSize="large"
        />
      );
    }).not.toThrow();
  });
});
