import React from "react";
import { mount, shallow } from "enzyme";
import { componentWithStore, createMockStore } from "../../test/testhelpers";
import { getPrefabProfile } from "../../test/testProfiles";
import EditAvatarModal from "../EditAvatarModal";

const userProfile = getPrefabProfile(0);
const displayProfile = getPrefabProfile(3);
const initialState = {
  user: {
    id: userProfile.fromId,
    displayId: displayProfile.fromId as string | undefined,
  },
  profiles: {
    profiles: {
      [userProfile.fromId]: userProfile,
      [displayProfile.fromId]: displayProfile,
    },
  },
};
const store = createMockStore(initialState);

describe("EditAvatarModal", () => {
  it("renders without crashing", () => {
    expect(() => {
      shallow(
        componentWithStore(
          () => <EditAvatarModal setNewIcon={jest.fn} />,
          createMockStore(store)
        )
      );
    }).not.toThrow();
  });

  it("adds photo", async () => {
    const component = mount(
      componentWithStore(EditAvatarModal, store, { setNewIcon: jest.fn() })
    );
    component.find(".EditAvatarModal__edit").simulate("click");
    component.find("input").simulate("change", {
      target: { value: "https://placekitten.com/300/300" },
    });
    component
      .find(".NewPostImageUpload__urlInputBtn")
      .first()
      .simulate("click");
    expect(component.find("input").props().value).toEqual(
      "https://placekitten.com/300/300"
    );
  });
});
