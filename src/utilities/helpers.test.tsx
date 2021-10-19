import React from "react";
import * as helpers from "../utilities/helpers";

describe("helpers", () => {
  const setThumbnailMock = jest.fn();
  const thumbnail = "";
  const useStateMock: any = (thumbnail: string) => [
    thumbnail,
    setThumbnailMock,
  ];
  jest.spyOn(React, "useState").mockImplementation(useStateMock);

  it("returns youtube video thumbnail from link in nav bar", () => {
    helpers.getThumbnail(
      "https://www.youtube.com/watch?v=gbYqlbZumc0",
      setThumbnailMock
    );
    expect(setThumbnailMock).toHaveBeenCalledWith(
      "https://www.youtube.com/watch?v=gbYqlbZumc0"
    );
    expect(thumbnail).toEqual(
      "https://img.youtube.com/vi/gbYqlbZumc0/mqdefault.jpg"
    );
  });

  it("returns youtube video thumbnail from share link", () => {
    helpers.getThumbnail("https://youtu.be/gbYqlbZumc0", setThumbnailMock);
    expect(thumbnail).toEqual(
      "https://img.youtube.com/vi/gbYqlbZumc0/mqdefault.jpg"
    );
  });

  it("returns youtube video thumbnail from embedded link", () => {
    helpers.getThumbnail(
      "https://www.youtube.com/embed/gbYqlbZumc0",
      setThumbnailMock
    );
    expect(thumbnail).toEqual(
      "https://img.youtube.com/vi/gbYqlbZumc0/mqdefault.jpg"
    );
  });

  it("returns vimeo video thumbnail", () => {
    helpers.getThumbnail("https://vimeo.com/571191143", setThumbnailMock);
    expect(thumbnail).toEqual("https://vumbnail.com/571191143.jpg");
  });

  it("returns img thumbnail", () => {
    helpers.getThumbnail(
      "https://www.mccourt.com/siteFiles/Professionals/Braxton_12.20_BW.jpg",
      setThumbnailMock
    );
    expect(thumbnail).toEqual(
      "https://www.mccourt.com/siteFiles/Professionals/Braxton_12.20_BW.jpg"
    );
  });

  it("returns img thumbnail if no extension", () => {
    helpers.getThumbnail("https://placekitten.com/300/300", setThumbnailMock);
    expect(thumbnail).toEqual(undefined);
  });

  it("returns undefined if no thumbnail is available", () => {
    helpers.getThumbnail("123", jest.fn);
    expect(thumbnail).toEqual(undefined);
  });
});
