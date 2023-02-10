const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    size: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["t-shirt", "sweater", "jeans", "shoes", "jacket", "hat", "blouse", "chinos", "socks"],
      required: true,
    },
    price: {
      type: Number,
      required: true
    },
    productDetails: {
      type: String,
      default: "item description",
    },
    available:{
      type: Boolean,
      required: true,
    },
    images: {
      type: [String],
      default: ["https://react.semantic-ui.com/images/wireframe/image.png"],
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const ProductModel = model("Product", productSchema);

module.exports = ProductModel;
