import React from "react";
import { shallow } from "enzyme";
import UserAvatar from "../UserAvatar";
import { getPrefabdsnpUserId } from "../../test/testAddresses";

describe("UserAvatar", () => {
  it("renders without crashing", () => {
    expect(() => {
      shallow(
        <UserAvatar
          profileAddress={getPrefabdsnpUserId(0)}
          avatarSize="large"
        />
      );
    }).not.toThrow();
  });
});
