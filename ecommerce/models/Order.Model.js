const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    products: {
        type: [Schema.Types.ObjectId],
        ref: 'Product'
    },
    totalPrice: Number,
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const OrderModel = model("Order", orderSchema);

module.exports = OrderModel;