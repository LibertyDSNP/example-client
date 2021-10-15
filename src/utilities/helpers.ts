export const getThumbnail = (url: string): string | undefined => {
  const isYoutubeVideo = url.match(
    /\/\/((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w]+)(\S+)?$/i
  );
  if (isYoutubeVideo)
    return "https://img.youtube.com/vi/" + isYoutubeVideo[4] + "/mqdefault.jpg";

  const isVimeoVideo = url.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i);
  if (isVimeoVideo) return "https://vumbnail.com/" + isVimeoVideo[1] + ".jpg";

  const isImage = url.match(/\.(jpeg|jpg|gif|png|svg)$/);
  if (isImage) return url;

  return;
};
