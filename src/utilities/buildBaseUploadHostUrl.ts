export const buildBaseUploadHostUrl = (qualifiedUrl: boolean): string => {
  return qualifiedUrl
    ? `${window.location.host}/${process.env.REACT_APP_UPLOAD_HOST}`
    : `${process.env.REACT_APP_UPLOAD_HOST}`;
};
