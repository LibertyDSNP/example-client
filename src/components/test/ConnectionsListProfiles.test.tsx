import ConnectionsListProfiles from "../ConnectionsListProfiles";
import { shallow, mount } from "enzyme";
import { preFabProfiles } from "../../test/testProfiles";
import { componentWithStore, createMockStore } from "../../test/testhelpers";

enum ListStatus {
  CLOSED,
  FOLLOWERS,
  FOLLOWING,
}

const mockTempUserList = [
  preFabProfiles[0],
  preFabProfiles[1],
  preFabProfiles[2],
  preFabProfiles[3],
];

describe("ConnectionsListProfiles", () => {
  it("renders without crashing", () => {
    expect(() => {
      shallow(
        componentWithStore(ConnectionsListProfiles, createMockStore({}), {
          listStatus: ListStatus.FOLLOWING,
          connectionsList: mockTempUserList,
          notFollowingList: [preFabProfiles[1]],
        })
      );
    }).not.toThrow();
  });

  it("displays correct follow button", () => {
    const component = mount(
      componentWithStore(ConnectionsListProfiles, createMockStore({}), {
        listStatus: ListStatus.FOLLOWING,
        connectionsList: mockTempUserList,
        notFollowingList: [preFabProfiles[0]],
      })
    );
    expect(
      component.find(".ConnectionsListProfiles__button").first().text()
    ).toContain("Follow");
  });

  it("displays correct unfollow button", () => {
    const component = mount(
      componentWithStore(ConnectionsListProfiles, createMockStore({}), {
        listStatus: ListStatus.FOLLOWERS,
        connectionsList: mockTempUserList,
        notFollowingList: [preFabProfiles[0]],
      })
    );
    expect(
      component.find(".ConnectionsListProfiles__button").at(1).text()
    ).toContain("Unfollow");
    expect(
      component.find(".ConnectionsListProfiles__button").at(2).text()
    ).toContain("Unfollow");
    expect(
      component.find(".ConnectionsListProfiles__button").at(3).text()
    ).toContain("Unfollow");
  });
});
