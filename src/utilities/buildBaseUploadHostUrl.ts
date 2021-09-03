export const buildBaseUploadHostUrl = (): string => {
  return process.env.REACT_APP_UPLOAD_HOST || window.location.host;
};
