const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        _id: false,
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        amount: Number,
      },
    ],
    totalPrice: Number,
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const OrderModel = model("Order", orderSchema);

module.exports = OrderModel;
