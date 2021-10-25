import * as helpers from "../utilities/helpers";

describe("helpers", () => {
  it("returns youtube video thumbnail from link in nav bar", async () => {
    const thumbnail = helpers.getThumbnailUrl(
      "https://www.youtube.com/watch?v=gbYqlbZumc0"
    );
    expect(thumbnail).toEqual(
      "https://img.youtube.com/vi/gbYqlbZumc0/mqdefault.jpg"
    );
  });

  it("returns youtube video thumbnail from share link", () => {
    const thumbnail = helpers.getThumbnailUrl("https://youtu.be/gbYqlbZumc0");
    expect(thumbnail).toEqual(
      "https://img.youtube.com/vi/gbYqlbZumc0/mqdefault.jpg"
    );
  });

  it("returns youtube video thumbnail from embedded link", () => {
    const thumbnail = helpers.getThumbnailUrl(
      "https://www.youtube.com/embed/gbYqlbZumc0"
    );
    expect(thumbnail).toEqual(
      "https://img.youtube.com/vi/gbYqlbZumc0/mqdefault.jpg"
    );
  });

  it("returns vimeo video thumbnail", () => {
    const thumbnail = helpers.getThumbnailUrl("https://vimeo.com/571191143");
    expect(thumbnail).toEqual("https://vumbnail.com/571191143.jpg");
  });

  it("returns img thumbnail", () => {
    const thumbnail = helpers.getThumbnailUrl(
      "https://www.mccourt.com/siteFiles/Professionals/Braxton_12.20_BW.jpg"
    );
    expect(thumbnail).toEqual(
      "https://www.mccourt.com/siteFiles/Professionals/Braxton_12.20_BW.jpg"
    );
  });

  it("returns img thumbnail if no extension", () => {
    const thumbnail = helpers.getThumbnailUrl(
      "https://placekitten.com/300/300"
    );
    expect(thumbnail).toEqual("https://placekitten.com/300/300");
  });

  it("returns undefined if no thumbnail is available", () => {
    const thumbnail = helpers.getThumbnailUrl("123");
    expect(thumbnail).toEqual("123");
  });
});
