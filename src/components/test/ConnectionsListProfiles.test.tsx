import ConnectionsListProfiles from "../ConnectionsListProfiles";
import { shallow, mount } from "enzyme";
import { preFabProfiles } from "../../test/testProfiles";
import { componentWithStore, createMockStore } from "../../test/testhelpers";
import {
  RelationshipState,
  RelationshipStatus,
} from "../../redux/slices/graphSlice";

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
  preFabProfiles[4],
];

const profiles = mockUserList.reduce((m, p) => ({ ...m, [p.fromId]: p }), {});

const followState = {
  status: RelationshipStatus.FOLLOWING,
  blockNumber: 0,
  blockIndex: 0,
  batchIndex: 0,
};
const following: Record<
  string,
  Record<string, RelationshipState>
> = mockUserList
  .slice(0, 3)
  .reduce((m, p) => ({ ...m, [p.fromId]: followState }), {});

const followers = mockUserList
  .slice(2)
  .reduce((m, p) => ({ ...m, [p.fromId]: followState }), {});

const userId = mockUserList[0].fromId;
const store = {
  user: { user: { id: userId } },
  profiles: { profiles: profiles },
  graphs: { following: { [userId]: following } },
};

describe("ConnectionsListProfiles", () => {
  it("renders without crashing", () => {
    expect(() => {
      shallow(
        componentWithStore(ConnectionsListProfiles, createMockStore(store), {
          listStatus: ListStatus.FOLLOWING,
          followedByDisplayUser: following,
          followingDisplayUser: followers,
          userId: userId,
        })
      );
    }).not.toThrow();
  });

  describe("when in closed mode", () => {
    it("hides all connections", () => {
      const component = mount(
        componentWithStore(ConnectionsListProfiles, createMockStore(store), {
          listStatus: ListStatus.CLOSED,
          followedByDisplayUser: following,
          followingDisplayUser: followers,
          userId: userId,
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
          followedByDisplayUser: following,
          followingDisplayUser: followers,
          userId: userId,
        })
      );
      expect(component.find(".ConnectionsListProfiles__profile").length).toBe(
        Object.keys(following).length
      );
      expect(
        component.find(".ConnectionsListProfiles__name").first().text()
      ).toContain(mockUserList[0].fromId);
      expect(
        component.find(".ConnectionsListProfiles__name").at(1).text()
      ).toContain(mockUserList[1].fromId);
      expect(
        component.find(".ConnectionsListProfiles__name").at(2).text()
      ).toContain(mockUserList[2].fromId);
    });

    it("all connections can be unfollowed", () => {
      const component = mount(
        componentWithStore(ConnectionsListProfiles, createMockStore(store), {
          listStatus: ListStatus.FOLLOWING,
          followedByDisplayUser: following,
          followingDisplayUser: followers,
          userId: userId,
        })
      );
      expect(component.find(".GraphChangeButton").at(0).text()).toContain(
        "Unfollow"
      );
      expect(component.find(".GraphChangeButton").at(1).text()).toContain(
        "Unfollow"
      );
      expect(component.find(".GraphChangeButton").at(2).text()).toContain(
        "Unfollow"
      );
    });
  });

  describe("when in followers mode", () => {
    it("shows all followers", () => {
      const component = mount(
        componentWithStore(ConnectionsListProfiles, createMockStore(store), {
          listStatus: ListStatus.FOLLOWERS,
          followedByDisplayUser: following,
          followingDisplayUser: followers,
        })
      );
      expect(component.find(".ConnectionsListProfiles__profile").length).toBe(
        Object.keys(followers).length
      );
      expect(
        component.find(".ConnectionsListProfiles__name").first().text()
      ).toContain(mockUserList[2].fromId);
      expect(
        component.find(".ConnectionsListProfiles__name").at(1).text()
      ).toContain(mockUserList[3].fromId);
      expect(
        component.find(".ConnectionsListProfiles__name").at(2).text()
      ).toContain(mockUserList[4].fromId);
    });

    it("all followers can be followed or unfollowed depending on status", () => {
      const component = mount(
        componentWithStore(ConnectionsListProfiles, createMockStore(store), {
          listStatus: ListStatus.FOLLOWERS,
          followedByDisplayUser: following,
          followingDisplayUser: followers,
          userId: userId,
        })
      );
      expect(
        component
          .find(".ConnectionsListProfiles__profile")
          .at(0)
          .find(".GraphChangeButton")
          .first()
          .text()
      ).toContain("Unfollow");
      expect(
        component
          .find(".ConnectionsListProfiles__profile")
          .at(1)
          .find(".GraphChangeButton")
          .first()
          .text()
      ).toContain("Follow");
      expect(
        component
          .find(".ConnectionsListProfiles__profile")
          .at(2)
          .find(".GraphChangeButton")
          .first()
          .text()
      ).toContain("Follow");
    });
  });
});
