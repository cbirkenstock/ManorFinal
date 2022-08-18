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
    if (url.includes("www.")) {
      return url.split("www.")[1].slice(0, -1);
    } else {
      return url.split("://")[1].slice(0, -1);
    }
  }
};
