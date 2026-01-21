const mongoose = require("mongoose");

const connectionReqSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "rejected", "accepted"],
        message: `{VALUE} is not a valid status`,
      },
      require: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

connectionReqSchema.index({ fromUserId: 1, toUserId: 1 });

connectionReqSchema.pre("save", function () {
  const req = this;
  if (req.fromUserId.equals(req.toUserId)) {
    throw new Error("cant send request to own");
  }
  //   next();
});

module.exports = mongoose.model("connectionRequest", connectionReqSchema);
