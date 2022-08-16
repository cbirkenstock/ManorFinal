import { getLinkPreview } from "link-preview-js";

export const ContainsUrl = (string: string) => {
  return (
    string.includes("http://") ||
    string.includes("https://") ||
    string.includes("Http://") ||
    string.includes("Https://")
  );
};

export const extractWebInfo = async (url: string) => {
  const data = await getLinkPreview(url);

  return data;
};

export const getPrettyUrl = (url?: string) => {
  if (url) {
    return url.split("www.")[0];
  }
};
