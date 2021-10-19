export const getThumbnail = (
  url: string,
  setThumbnail: (url: string) => void
): void => {
  const thumbnailSrc = new Image();
  thumbnailSrc.src = url;
  thumbnailSrc.onload = function () {
    console.log("onload", url);
    return setThumbnail(url);
  };
  thumbnailSrc.onerror = function () {
    console.log("onerror", url);
    const isYoutubeVideo = url.match(
      /\/\/((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w]+)(\S+)?$/i
    );
    if (isYoutubeVideo)
      return setThumbnail(
        "https://img.youtube.com/vi/" + isYoutubeVideo[4] + "/mqdefault.jpg"
      );

    const isVimeoVideo = url.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i);
    if (isVimeoVideo)
      return setThumbnail("https://vumbnail.com/" + isVimeoVideo[1] + ".jpg");
  };
};
