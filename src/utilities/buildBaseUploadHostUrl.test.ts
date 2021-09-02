import { buildBaseUploadHostUrl } from "./buildBaseUploadHostUrl";

describe("buildBaseUploadHostUrl", () => {
  let windowSpy: jest.SpyInstance<Window>;
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    windowSpy.mockRestore();
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });
  describe("when needing a qualified url", () => {
    const originalWindow = { ...window };
    windowSpy = jest.spyOn(window, "window", "get");
    windowSpy.mockImplementation((): any => ({
      ...originalWindow,
      location: {
        ...originalWindow.location,
        host: "http://example.com",
      },
    }));

    process.env.REACT_APP_UPLOAD_HOST = "/test";

    it("returns a qualified url for REACT_APP_UPLOAD_HOST", () => {
      expect(buildBaseUploadHostUrl(true)).toEqual("http://example.com//test");
    });

    it("does not return a qualified url for REACT_APP_UPLOAD_HOST", () => {
      expect(buildBaseUploadHostUrl(false)).toEqual("/test");
    });
  });
});
