import ConnectionsListProfiles from "../ConnectionsListProfiles";
import { shallow, mount } from "enzyme";
import { preFabProfiles } from "../../test/testProfiles";
import { componentWithStore, createMockStore } from "../../test/testhelpers";

enum ListStatus {
  CLOSED,
  FOLLOWERS,
  FOLLOWING,
}

const mockUserList = [
  preFabProfiles[0],
  preFabProfiles[1],
  preFabProfiles[2],
  preFabProfiles[3],
];

const profiles = mockUserList.reduce((m, p) => ({ ...m, [p.fromId]: p }), {});

const following = mockUserList
  .slice(0, 2)
  .reduce((m, p) => ({ ...m, [p.fromId]: true }), {});

const followers = mockUserList
  .slice(1)
  .reduce((m, p) => ({ ...m, [p.fromId]: true }), {});

const store = {
  profiles: { profiles: profiles },
};

describe("ConnectionsListProfiles", () => {
  it("renders without crashing", () => {
    expect(() => {
      shallow(
        componentWithStore(ConnectionsListProfiles, createMockStore(store), {
          listStatus: ListStatus.FOLLOWING,
          followers: followers,
          following: following,
        })
      );
    }).not.toThrow();
  });

  describe("when in closed mode", () => {
    it("hides all connections", () => {
      const component = mount(
        componentWithStore(ConnectionsListProfiles, createMockStore(store), {
          listStatus: ListStatus.CLOSED,
          followers: followers,
          following: following,
        })
      );
      expect(component.find(".ConnectionsListProfiles__profile").length).toBe(
        0
      );
    });
  });

  describe("when in following mode", () => {
    it("shows all connections user is following", () => {
      const component = mount(
        componentWithStore(ConnectionsListProfiles, createMockStore(store), {
          listStatus: ListStatus.FOLLOWING,
          followers: followers,
          following: following,
        })
      );
      expect(component.find(".ConnectionsListProfiles__profile").length).toBe(
        2
      );
      expect(
        component.find(".ConnectionsListProfiles__name").first().text()
      ).toContain(mockUserList[0].name);
      expect(
        component.find(".ConnectionsListProfiles__name").at(1).text()
      ).toContain(mockUserList[1].name);
    });

    it("all connections can be unfollowed", () => {
      const component = mount(
        componentWithStore(ConnectionsListProfiles, createMockStore(store), {
          listStatus: ListStatus.FOLLOWING,
          followers: followers,
          following: following,
        })
      );
      expect(
        component.find(".ConnectionsListProfiles__button").at(0).text()
      ).toContain("Unfollow");
      expect(
        component.find(".ConnectionsListProfiles__button").at(1).text()
      ).toContain("Unfollow");
    });
  });

  describe("when in followers mode", () => {
    it("shows all followers", () => {
      const component = mount(
        componentWithStore(ConnectionsListProfiles, createMockStore(store), {
          listStatus: ListStatus.FOLLOWERS,
          followers: followers,
          following: following,
        })
      );
      expect(component.find(".ConnectionsListProfiles__profile").length).toBe(
        3
      );
      expect(
        component.find(".ConnectionsListProfiles__name").first().text()
      ).toContain(mockUserList[1].name);
      expect(
        component.find(".ConnectionsListProfiles__name").at(1).text()
      ).toContain(mockUserList[2].name);
      expect(
        component.find(".ConnectionsListProfiles__name").at(2).text()
      ).toContain(mockUserList[3].name);
    });

    it("all followers can be followed or unfollowed depending on status", () => {
      const component = mount(
        componentWithStore(ConnectionsListProfiles, createMockStore(store), {
          listStatus: ListStatus.FOLLOWERS,
          followers: followers,
          following: following,
        })
      );
      expect(
        component
          .find(".ConnectionsListProfiles__profile")
          .at(0)
          .find(".ConnectionsListProfiles__button")
          .first()
          .text()
      ).toContain("Unfollow");
      expect(
        component
          .find(".ConnectionsListProfiles__profile")
          .at(1)
          .find(".ConnectionsListProfiles__button")
          .first()
          .text()
      ).toContain("Follow");
      expect(
        component
          .find(".ConnectionsListProfiles__profile")
          .at(2)
          .find(".ConnectionsListProfiles__button")
          .first()
          .text()
      ).toContain("Follow");
    });
  });
});
