const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const connectionRequest = require("../modelsOschemas/connectionRequest");
const sendEmail = require("./sendEmail");

cron.schedule("0 8 * * *", async () => {
  //send emails to all people who got requests the previous day;
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await connectionRequest
      .find({
        status: "interested",
        createdAt: {
          $gte: yesterdayStart,
          $lt: yesterdayEnd,
        },
      })
      .populate("fromUserId toUserId");
    const uniqueUsersMap = new Map();

    pendingRequests.forEach((req) => {
      const email = req.toUserId.emailId;
      const name = req.toUserId.firstName; // or fullName

      if (!uniqueUsersMap.has(email)) {
        uniqueUsersMap.set(email, {
          email,
          name,
        });
      }
    });

    const listOfEmailIDs = Array.from(uniqueUsersMap.values());

    for (const email of listOfEmailIDs) {
      try {
        const res = await sendEmail.run(
          "New connection request on DevTalk 🚀",
          email.name,
          //   isUserOrNot.emailId,
        );
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
});
