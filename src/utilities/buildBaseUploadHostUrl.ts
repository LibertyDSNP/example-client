/**
 * buildBaseUploadHostUrl returns the REACT_APP_UPLOAD_HOST
 * or the current browser base url for if the server hosting the content
 * is accessible using the same url
 * @param path - The path to append to the url
 * @returns the fully qualified URL
 */
export const buildBaseUploadHostUrl = (path: string): URL => {
  if (process.env.REACT_APP_UPLOAD_HOST) {
    return new URL(path, process.env.REACT_APP_UPLOAD_HOST);
  }
  return new URL(path, `${window.location.protocol}//${window.location.host}`);
};
