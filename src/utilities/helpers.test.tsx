import React from "react";
import * as helpers from "../utilities/helpers";

describe("helpers", () => {
  it("returns youtube video thumbnail from link in nav bar", () => {
    const thumbnail = helpers.getThumbnail(
      "https://www.youtube.com/watch?v=gbYqlbZumc0"
    );
    expect(thumbnail).toEqual(
      "https://img.youtube.com/vi/gbYqlbZumc0/mqdefault.jpg"
    );
  });

  it("returns youtube video thumbnail from share link", () => {
    const thumbnail = helpers.getThumbnail("https://youtu.be/gbYqlbZumc0");
    expect(thumbnail).toEqual(
      "https://img.youtube.com/vi/gbYqlbZumc0/mqdefault.jpg"
    );
  });

  it("returns youtube video thumbnail from embedded link", () => {
    const thumbnail = helpers.getThumbnail(
      "https://www.youtube.com/embed/gbYqlbZumc0"
    );
    expect(thumbnail).toEqual(
      "https://img.youtube.com/vi/gbYqlbZumc0/mqdefault.jpg"
    );
  });

  it("returns vimeo video thumbnail", () => {
    const thumbnail = helpers.getThumbnail("https://vimeo.com/571191143");
    expect(thumbnail).toEqual("https://vumbnail.com/571191143.jpg");
  });

  it("returns img thumbnail", () => {
    const thumbnail = helpers.getThumbnail(
      "https://www.mccourt.com/siteFiles/Professionals/Braxton_12.20_BW.jpg"
    );
    expect(thumbnail).toEqual(
      "https://www.mccourt.com/siteFiles/Professionals/Braxton_12.20_BW.jpg"
    );
  });

  it("returns undefined if no thumbnail is available", () => {
    const thumbnail = helpers.getThumbnail("123");
    expect(thumbnail).toEqual(undefined);
  });
});
