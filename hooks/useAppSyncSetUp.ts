import { AWSAppSyncClient, buildSync } from "aws-appsync";
import config from "../src/aws-exports.js";

const useAppSyncSetUp = () => {
  const client = new AWSAppSyncClient({
    url: config.aws_appsync_graphqlEndpoint,
    region: config.aws_appsync_region,
    auth: {
      type: "API_KEY",
      apiKey: config.aws_appsync_apiKey,
    },
  });

  return client;
};

export default useAppSyncSetUp;
