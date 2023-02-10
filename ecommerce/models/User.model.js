const { Schema, model } = require("mongoose");

const validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return re.test(email)
}

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
      validate: [validateEmail, 'Please fill a valid email address'],
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
      ref: "Product",
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
