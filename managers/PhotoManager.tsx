export const fetchSignedUrl = async (url: string) => {
  const https =
    "https://f2hz7p4po1.execute-api.us-east-1.amazonaws.com/default/ManorSignedURL?" +
    url;

  try {
    const response = await fetch(https);
    const json = await response.json();
    const signedUrl = json.signedURL;
    return signedUrl;
  } catch (error) {
    console.log(error);
  }
};
