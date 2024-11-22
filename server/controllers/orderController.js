import OrdersModel from "../models/orders.js";
import UsersModel from "../models/users.js";
import ProductsModel from "../models/products.js";

export const createOrUpdateOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const { quantity, productId, productName } = req.body;
    const user = await UsersModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let product;
    if (productId) {
      product = await ProductsModel.findById(productId);
    } else if (productName) {
      product = await ProductsModel.findOne({ productName });
    }
    if (!product) return res.status(404).json({ message: "Product not found" });

    const existingOrder = await OrdersModel.findOne({ userId, productId: product._id });
    if (existingOrder) {
      existingOrder.quantity += quantity;
      existingOrder.price = existingOrder.quantity * product.price;
      if (product.stock < quantity) {
        return res.status(400).json({ message: "Not enough stock available" });
      }
      product.stock -= quantity;
      await product.save();
      const updatedOrder = await existingOrder.save();
      return res.status(200).json({ message: "Order updated successfully", data: updatedOrder });
    } else {
      const totalPrice = product.price * quantity;
      const newOrder = new OrdersModel({
        quantity,
        price: totalPrice,
        userId: user._id,
        productId: product._id,
        productName: product.productName,
      });
      if (product.stock < quantity) {
        return res.status(400).json({ message: "Not enough stock available" });
      }
      product.stock -= quantity;
      await product.save();
      const savedOrder = await newOrder.save();
      res.status(201).json({ message: "Order created successfully", data: savedOrder });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to create or update order", error: error.message });
  }
};