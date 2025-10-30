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

heartSchema.index({ author: 1, targetId: 1, targetType: 1 }, { unique: true });

module.exports = mongoose.model("Heart", heartSchema);
