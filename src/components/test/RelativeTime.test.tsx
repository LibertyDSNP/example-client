import React from "react";
import renderer from "react-test-renderer";
import RelativeTime from "../RelativeTime";

describe("relative time", () => {
  it("renders without crashing", () => {
    const announcement = { published: Date.now() };
    expect(() => {
      renderer.create(
        <RelativeTime published={announcement.published} postStyle={true} />
      );
    }).not.toThrow();
  });
  it("renders seconds as expected", () => {
    const announcement = { published: Date.now() / 1000 - 10 };
    const rendered = renderer.create(
      <RelativeTime published={announcement.published} postStyle={true} />
    );
    expect(rendered).toMatchSnapshot();
  });
  it("renders minutes as expected", () => {
    const announcement = { published: Date.now() / 1000 - 100 };
    const rendered = renderer.create(
      <RelativeTime published={announcement.published} postStyle={true} />
    );
    expect(rendered).toMatchSnapshot();
  });
  it("renders hours as expected", () => {
    const announcement = { published: Date.now() / 1000 - 10000 };
    const rendered = renderer.create(
      <RelativeTime published={announcement.published} postStyle={true} />
    );
    expect(rendered).toMatchSnapshot();
  });
  it("renders years as expected", () => {
    const date = new Date("2019-11-19");
    const announcement = {
      published: +date / 1000 - 31557600,
    };
    const rendered = renderer.create(
      <RelativeTime published={announcement.published} postStyle={true} />
    );
    expect(rendered).toMatchSnapshot();
  });
});
