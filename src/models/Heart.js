const mongoose = require("mongoose");

const heartSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },

    targetType: {
      type: String,
      enum: ["Post", "Comment"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Heart", heartSchema);
