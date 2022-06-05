const aws = require("aws-sdk");
const ddb = new aws.DynamoDB();

const tableName = process.env.USERTABLE;

exports.handler = async (event) => {
  // event event.request.userAttributes.(sub, email, )
  // insert code to be executed by your lambda trigger
  //save new user to dynamoDB

  if (!event?.request?.userAttributes?.sub) {
    console.log("No sub provided");
    return;
  }

  const now = new Date();
  const timestamp = now.getTime();
  const phone = event.request.userAttributes.phone_number.toString();
  const awsPhone =
    phone.slice(0, 2) +
    " " +
    phone.slice(2, 5) +
    " " +
    phone.slice(5, 8) +
    " " +
    phone.slice(8);

  const userItem = {
    id: { S: event.request.userAttributes.sub },
    __typename: { S: "User" },
    _lastChangedAt: { N: timestamp.toString() },
    _version: { N: "1" },
    updatedAt: { S: now.toISOString() },
    createdAt: { S: now.toISOString() },
    name: { S: event.request.userAttributes.name },
    phoneNumber: { S: awsPhone },
  };

  const params = {
    Item: userItem,
    TableName: tableName,
  };

  try {
    await ddb.putItem(params).promise();
  } catch (e) {
    console.log(e);
  }
};
