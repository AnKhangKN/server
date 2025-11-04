const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    groupName: { type: String, required: true },

    groupAvatar: { type: String, required: true },

    groupCoverImage: { type: String, default: "" },

    groupPrivacy: { type: String, enum: ["public", "approve"], required: true },

    groupAdmin: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    groupMember: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    groupMemberCount: { type: Number, default: 0 },

    joinRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    introduction: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);
