import Api from "../services/api";

export const getProfileImage = (picture?: string) => {
  if (!picture) {
    return "/default.png";
  }

  if (picture.startsWith("http")) {
    return picture;
  }

  return `${Api.defaults.baseURL}/images/users/${picture}`;
};