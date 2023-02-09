const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    address: {
      street: String,
      houseNumber: Number,
      postalCode: String,
      city: String,
      country: String,
    },
    cart: {
      type: [Schema.Types.ObjectId],
      ref: "order",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const UserModel = model("User", userSchema);

module.exports = UserModel;
