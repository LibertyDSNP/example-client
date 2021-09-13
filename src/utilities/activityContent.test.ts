import { ActivityContentAudio, ActivityContentVideo } from "@dsnp/sdk/core/activityContent";
import { createActivityContentNote } from "./activityContent";

describe("activityContent", () => {
  describe("noteToActivityContentNote", () => {
    [
      {
        name: "youtube",
        uri: "https://www.youtube.com/watch?v=1qpVkh61meM",
        attachmentType: "text/html",
        mediaType: "Video",
      },
      {
        name: "vimeo",
        uri: "https://vimeo.com/27732793",
        attachmentType: "text/html",
        mediaType: "Video",
      },
      {
        name: "soundcloud",
        uri: "https://soundcloud.com/sistema-bomb/bemba-y-tablao-sistema-bomb",
        attachmentType: "text/html",
        mediaType: "Video",
      },
      {
        name: "MP4",
        uri:
          "https://filesamples.com/samples/video/mp4/sample_960x400_ocean_with_audio.mp4",
        attachmentType: "video/mp4",
        mediaType: "Video",
      },
      {
        name: "MP3",
        uri:
          "https://archive.org/download/78_the-one-i-love-belongs-to-somebody-else_ella-fitzgerald-albert-von-tilzer-lew-bro_gbia8001485/01%20-%20I%27M%20THE%20LONESOMEST%20GAL%20IN%20TOWN%20-%20ELLA%20FITZGERALD.mp3",
        attachmentType: "audio/mpeg",
        mediaType: "Audio",
      },
      {
        name: "Ogg-Vorbis",
        uri:
          "https://archive.org/download/penguin_island_ms_librivox/penguin_island_01_france.ogg",
        attachmentType: "audio/ogg",
        mediaType: "Audio",
      },
      {
        name: "WebM",
        uri:
          "https://filesamples.com/samples/video/webm/sample_960x400_ocean_with_audio.webm",
        attachmentType: "video/webm",
        mediaType: "Video",
      },
      {
        name: "Windows Media Video",
        uri: "https://filesamples.com/samples/video/wmv/sample_640x360.wmv",
        attachmentType: "video/x-ms-wmv",
        mediaType: "Video",
      },
    ].forEach((tc: any) => {
      it(`${tc.name} is correctly typed`, () => {
        const res = createActivityContentNote("test", [tc.uri]);
        expect(res.mediaType).toEqual("text/plain");
        const att = res.attachment?.pop();
        expect(att?.type).toEqual(tc.mediaType);
        const linkAttach = att as ActivityContentAudio | ActivityContentVideo;
        const url = linkAttach?.url.pop();
        expect(url?.type).toEqual("Link");
        expect(url?.mediaType).toEqual(tc.attachmentType);
      });
    });
  });
});
