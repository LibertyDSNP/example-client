import { mount } from "enzyme";
import NewPostImageUpload from "../NewPostImageUpload";
import { componentWithStore, createMockStore } from "../../test/testhelpers";

const changeUrlInput = (component: any, url: string) => {
  component
    .find(".NewPostImageUpload__urlInput")
    .first()
    .simulate("change", {
      target: { value: url },
    });
  component.find(".NewPostImageUpload__urlInputBtn").first().simulate("click");
};

describe("NewPostImageUpload", () => {
  const initialState = { user: { walletType: "METAMASK" }, feed: { feed: [] } };
  const store = createMockStore(initialState);

  beforeEach(() => jest.clearAllMocks());

  it("displays youtube video thumbnail from link in nav bar", () => {
    const component = mount(
      componentWithStore(NewPostImageUpload, store, {
        onNewPostImageUpload: jest.fn(),
      })
    );
    changeUrlInput(component, "https://www.youtube.com/watch?v=gbYqlbZumc0");
    expect(
      component.find(".NewPostThumbnails__image").first().props().src
    ).toContain("gbYqlbZumc0");
  });

  it("displays youtube video thumbnail from share link", () => {
    const component = mount(
      componentWithStore(NewPostImageUpload, store, {
        onNewPostImageUpload: jest.fn(),
      })
    );
    changeUrlInput(component, "https://youtu.be/gbYqlbZumc0");
    expect(
      component.find(".NewPostThumbnails__image").first().props().src
    ).toContain("gbYqlbZumc0");
  });

  it("displays youtube video thumbnail from embedded link", () => {
    const component = mount(
      componentWithStore(NewPostImageUpload, store, {
        onNewPostImageUpload: jest.fn(),
      })
    );
    changeUrlInput(component, "https://www.youtube.com/embed/gbYqlbZumc0");
    expect(
      component.find(".NewPostThumbnails__image").first().props().src
    ).toContain("gbYqlbZumc0");
  });

  it("displays vimeo video thumbnail", () => {
    const component = mount(
      componentWithStore(NewPostImageUpload, store, {
        onNewPostImageUpload: jest.fn(),
      })
    );
    changeUrlInput(component, "https://vimeo.com/571191143");
    expect(
      component.find(".NewPostThumbnails__image").first().props().src
    ).toContain("571191143");
  });

  it("displays img thumbnail", () => {
    const component = mount(
      componentWithStore(NewPostImageUpload, store, {
        onNewPostImageUpload: jest.fn(),
      })
    );
    changeUrlInput(
      component,
      "https://www.mccourt.com/siteFiles/Professionals/Braxton_12.20_BW.jpg"
    );
    expect(
      component.find(".NewPostThumbnails__image").first().props().src
    ).toEqual(
      "https://www.mccourt.com/siteFiles/Professionals/Braxton_12.20_BW.jpg"
    );
  });

  it("displays img thumbnail when image url has no extension", () => {
    const component = mount(
      componentWithStore(NewPostImageUpload, store, {
        onNewPostImageUpload: jest.fn(),
      })
    );
    changeUrlInput(component, "https://placekitten.com/300/300");
    expect(
      component.find(".NewPostThumbnails__image").first().props().src
    ).toEqual("https://placekitten.com/300/300");
  });

  it("displays placeholder when there is not a valid thumbnail", () => {
    const component = mount(
      componentWithStore(NewPostImageUpload, store, {
        onNewPostImageUpload: jest.fn(),
      })
    );
    changeUrlInput(
      component,
      "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
    );
    expect(component.find(".NewPostThumbnails__imageAlt")).toBeDefined();
  });

  it("throws an error if invalid link", () => {
    const component = mount(
      componentWithStore(NewPostImageUpload, store, {
        onNewPostImageUpload: jest.fn(),
      })
    );
    changeUrlInput(component, "123");
    expect(component.find(".NewPostImageUpload__alert")).toBeDefined();
  });
});
