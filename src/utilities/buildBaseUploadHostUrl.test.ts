import { buildBaseUploadHostUrl } from "./buildBaseUploadHostUrl";

describe("buildBaseUploadHostUrl", () => {
  let windowSpy: jest.SpyInstance<Window>;
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    windowSpy.mockClear();
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
        host: "example.com",
        protocol: "http:",
      },
    }));

    it("doesn't do a double / prefix for the path", () => {
      process.env.REACT_APP_UPLOAD_HOST = "http://test.com/";
      expect(buildBaseUploadHostUrl("/path").toString()).toEqual(
        "http://test.com/path"
      );
    });

    describe("when REACT_APP_UPLOAD_HOST is empty", () => {
      it("returns a qualified url", () => {
        process.env.REACT_APP_UPLOAD_HOST = "";
        expect(buildBaseUploadHostUrl("").toString()).toEqual(
          "http://example.com/"
        );
      });

      it("returns with the correct path", () => {
        process.env.REACT_APP_UPLOAD_HOST = "";
        expect(
          buildBaseUploadHostUrl("/i-am-a/path/yes/i/am").toString()
        ).toEqual("http://example.com/i-am-a/path/yes/i/am");
      });
    });

    describe("when REACT_APP_UPLOAD_HOST is NOT empty", () => {
      it("does not return a qualified url for REACT_APP_UPLOAD_HOST", () => {
        process.env.REACT_APP_UPLOAD_HOST = "http://localhost:3000";
        expect(buildBaseUploadHostUrl("").toString()).toEqual(
          "http://localhost:3000/"
        );
      });

      it("returns with the correct path", () => {
        process.env.REACT_APP_UPLOAD_HOST = "http://localhost:3000";
        expect(
          buildBaseUploadHostUrl("/i-am-a/path/yes/i/am").toString()
        ).toEqual("http://localhost:3000/i-am-a/path/yes/i/am");
      });
    });
  });
});
