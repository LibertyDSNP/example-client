import React from "react";
import renderer from "react-test-renderer";
import RelativeTime from "../RelativeTime";

describe("relative time", () => {
  it("renders without crashing", () => {
    const announcement = { published: new Date().toISOString() };
    expect(() => {
      renderer.create(
        <RelativeTime published={announcement.published} postStyle={true} />
      );
    }).not.toThrow();
  });
  it("renders seconds as expected", () => {
    const currentTime = new Date();
    const announcement = {
      published: new Date(
        currentTime.setSeconds(currentTime.getSeconds() - 10)
      ).toISOString(),
    };
    const rendered = renderer.create(
      <RelativeTime published={announcement.published} postStyle={true} />
    );
    expect(rendered).toMatchSnapshot();
  });
  it("renders minutes as expected", () => {
    const currentTime = new Date();
    const announcement = {
      published: new Date(
        currentTime.setMinutes(currentTime.getMinutes() - 1)
      ).toISOString(),
    };
    const rendered = renderer.create(
      <RelativeTime published={announcement.published} postStyle={true} />
    );
    expect(rendered).toMatchSnapshot();
  });
  it("renders hours as expected", () => {
    const currentTime = new Date();
    const announcement = {
      published: new Date(
        currentTime.setHours(currentTime.getHours() - 2)
      ).toISOString(),
    };
    const rendered = renderer.create(
      <RelativeTime published={announcement.published} postStyle={true} />
    );
    expect(rendered).toMatchSnapshot();
  });
  it("renders years as expected", () => {
    const currentTime = new Date("2018-11-18").toISOString();
    const announcement = {
      published: currentTime,
    };
    const rendered = renderer.create(
      <RelativeTime published={announcement.published} postStyle={true} />
    );
    expect(rendered).toMatchSnapshot();
  });
});
