const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const htmlTemplate = (senderName) => `
  <div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:30px;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; padding:30px; border-radius:10px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
      
      <h2 style="color:#4f46e5; margin-bottom:20px;">
        🚀 New Connection Request
      </h2>

      <p style="font-size:16px; color:#333;">
        Hi there,
      </p>

      <p style="font-size:15px; color:#555; line-height:1.6;">
        <strong>${senderName}</strong> just sent you a connection request on <strong>DevTalk</strong>.
      </p>

      <div style="text-align:center; margin:30px 0;">
        <a href="https://devtalk.online/requests"
           style="background:#4f46e5; color:#ffffff; padding:12px 25px; text-decoration:none; border-radius:6px; font-weight:bold;">
           View Request
        </a>
      </div>

      <p style="font-size:14px; color:#888;">
        If you’re not interested, you can safely ignore this email.
      </p>

      <hr style="margin:30px 0; border:none; border-top:1px solid #eee;" />

      <p style="font-size:12px; color:#aaa; text-align:center;">
        © 2026 DevTalk. All rights reserved.
      </p>

    </div>
  </div>
`;

const createSendEmailCommand = (toAddress, fromAddress, Subject, senderName) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data:  htmlTemplate(senderName),
        },
        Text: {
          Charset: "UTF-8",
          Data: "This is the text format email",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: Subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async (subject, body, toEmailId) => {
  const sendEmailCommand = createSendEmailCommand(
    "2shiwangi000@gmail.com",
    "shiwangi.newmediaholding@gmail.com",
    subject,
    body,
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };
