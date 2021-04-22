import ProfileBlock from "../ProfileBlock";
import { mount } from "enzyme";
import { getPrefabProfile } from "../../test/testProfiles";
import { componentWithStore, createMockStore } from "../../test/testhelpers";

const profile = getPrefabProfile(0);
const initialState = { user: { profile } };
const store = createMockStore(initialState);

describe("Profile", () => {
  it("renders without crashing", () => {
    expect(() => {
      mount(componentWithStore(ProfileBlock, store));
    }).not.toThrow();
  });

  it("matches snapshot", () => {
    expect(() => {
      mount(componentWithStore(ProfileBlock, store));
    }).toMatchSnapshot();
  });

  it("editable on edit button click", () => {
    const component = mount(componentWithStore(ProfileBlock, store));
    component.find(".Profile__editButton").first().simulate("click");
    expect(component.find(".Profile__name").props().disabled).toEqual(false);
    expect(component.find(".Profile__handle").props().disabled).toEqual(false);
  });

  describe("save button click", () => {
    it("save button disabled when not edited", () => {
      const component = mount(componentWithStore(ProfileBlock, store));
      component.find(".Profile__editButton").first().simulate("click");
      expect(
        component.find(".Profile__editButton").first().props().disabled
      ).toEqual(true);
    });
    it("save button enabled when edited", () => {
      const component = mount(componentWithStore(ProfileBlock, store));
      component.find(".Profile__editButton").first().simulate("click");
      component
        .find(".Profile__name")
        .simulate("change", { target: { value: "Monday NewLastName" } });
      expect(
        component.find(".Profile__editButton").first().props().disabled
      ).toEqual(false);
    });
    // it("saves on save button click", () => {
    //complete when we are actually writing to the blockchain so we can check the
    // return value or error message
    // });
  });

  it("cancels on cancel button click", () => {
    const component = mount(componentWithStore(ProfileBlock, store));
    component.find(".Profile__editButton").first().simulate("click");
    component
      .find(".Profile__name")
      .simulate("change", { target: { value: "Monday TestLastName" } });
    expect(component.find(".Profile__name").props().value).toEqual(
      "Monday TestLastName"
    );
    component.find(".Profile__editButton").last().simulate("click");
    expect(component.find(".Profile__name").props().value).toEqual(
      "Monday January"
    );
  });
});
