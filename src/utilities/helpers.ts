export const getThumbnailUrl = (url: string): string => {
  const isYoutubeVideo = url.match(
    /\/\/((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w]+)(\S+)?$/i
  );
  if (isYoutubeVideo)
    return "https://img.youtube.com/vi/" + isYoutubeVideo[4] + "/mqdefault.jpg";

  const isVimeoVideo = url.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i);
  if (isVimeoVideo) return "https://vumbnail.com/" + isVimeoVideo[1] + ".jpg";

  return url;
};
9;
