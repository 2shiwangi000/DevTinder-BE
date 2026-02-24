const { SESClient } = require("@aws-sdk/client-ses");
console.log("REGION:", process.env.SES_REGION);
console.log("ACCESS KEY:", process.env.AWS_ACCESS_KEY);
console.log("SECRET:", process.env.AWS_SECRET_KEY);
const REGION =  process.env.SES_REGION;

const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId:  process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

module.exports = { sesClient };
