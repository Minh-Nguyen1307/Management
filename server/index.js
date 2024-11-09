import express from "express";
import mongoose from "mongoose";
import UsersModel from "./model/users.js";
import OrdersModel from "./model/orders.js";
import ProductsModel from "./model/products.js";
mongoose.connect(
  "mongodb+srv://minhnguyen1307s2:0V9Y6nID4K75w3l0@management.byc0z.mongodb.net/?retryWrites=true&w=majority&appName=Management"
);
const app = express();

app.use(express.json());

app.post("/api/users", async (req, res) => {
  try {
    const { userName, email, age } = req.body;
    const existingUser = await UsersModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUser = new UsersModel({ userName, email, age });
    const savedUser = await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", data: savedUser });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res
      .status(500)
      .json({ message: "Failed to create user", error: error.message });
  }
});
app.post("/api/products", async (req, res) => {
  try {
    const { productName, stock, price } = req.body;
    const existingProductName = await ProductsModel.findOne({ productName });
    if (existingProductName) {
      return res.status(400).json({ message: "Product already in use" });
    }
    const newProduct = new ProductsModel({ productName, stock, price });
    const savedProduct = await newProduct.save();
    res
      .status(201)
      .json({ message: "Product created successfully", data: savedProduct });
  } catch (error) {
    console.error("Error creating product", error.message);
    res
      .status(500)
      .json({ message: "Failed to create product", error: error.message });
  }
});

app.post("/api/:userId/orders", async (req, res) => {
  try {
    const { userId } = req.params;
    const { quantity, productId, productName } = req.body;
    const user = await UsersModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let product;
    if (productId) {
      product = await ProductsModel.findById(productId);
    } else if (productName) {
      product = await ProductsModel.findOne({ productName });
    }
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingOrder = await OrdersModel.findOne({
      userId,
      productId: product._id,
    });
    if (existingOrder) {
      existingOrder.quantity += quantity;
      existingOrder.price = existingOrder.quantity * product.price;
      if (product.stock < quantity) {
        return res.status(400).json({ message: "Not enough stock available" });
      }
      product.stock -= quantity;
      await product.save();
      const updatedOrder = await existingOrder.save();
      return res
        .status(200)
        .json({ message: "Order updated successfully", data: updatedOrder });
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
      res
        .status(201)
        .json({ message: "Order created successfully", data: savedOrder });
    }
  } catch (error) {
    console.error("Error creating & updating order", error.message);
    res
      .status(500)
      .json({
        message: "Failed to create or update order",
        error: error.message,
      });
  }
});

app.get("/api/:userId/orders", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UsersModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orders = await OrdersModel.find({ userId: user._id });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res
      .status(200)
      .json({ message: "Orders fetched successfully", data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: error.message });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await UsersModel.find();
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found", data: [] });
    }
    res
      .status(200)
      .json({ message: "Users fetched successfully", data: users });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await ProductsModel.find();
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found", data: [] });
    }
    res
      .status(200)
      .json({ message: "Products fetched successfully", data: products });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: error.message });
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UsersModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(201).json({ message: "User fetched successfully", data: user });
  } catch (error) {
    console.error("Error fetching user", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch user", error: error.message });
  }
});

app.get("/api/orders/highvalue", async (req, res) => {
  try {
    const highValue = await OrdersModel.find({ price: { $gt: 10000000 } });
    if (!highValue.length) {
      return res.status(404).json({ message: "Orders not found" });
    }
    res
      .status(201)
      .json({
        message: "Orders with high value fetched successfully",
        data: highValue,
      });
  } catch (error) {
    console.error("Error fetching orders", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: error.message });
  }
});

app.get("/api/products/filter", async (req, res) => {
  try {
    const { minPrice = 0, maxPrice } = req.query;

    const priceFilter = {
      $gte: parseFloat(minPrice),
      $lte: parseFloat(maxPrice),
    };

    const filterProducts = await ProductsModel.find({ price: priceFilter });

    if (!filterProducts.length) {
      return res.status(404).json({ message: "Products not found" });
    }

    res
      .status(200)
      .json({
        message: "Filtered products fetched successfully",
        data: filterProducts,
      });
  } catch (error) {
    console.error("Error fetching products", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: error.message });
  }
});

app.put("/api/:userId/orders", async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, productName, quantity } = req.body;

    const user = await UsersModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let query = { userId: user._id };
    if (productId) {
      query.productId = productId;
    } else if (productName) {
      query.productName = productName;
    } else {
      return res
        .status(400)
        .json({ message: "Either productId or productName must be provided" });
    }

    const order = await OrdersModel.findOne(query);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    let productQuery = {};
    if (productId) {
      productQuery._id = productId;
    } else if (productName) {
      productQuery.productName = productName;
    }

    const product = await ProductsModel.findOne(productQuery);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    const quantityDifference = quantity - order.quantity;
    product.stock -= quantityDifference;

    order.quantity = quantity;
    order.price = product.price * quantity;
    order.productName = product.productName;

    await order.save();
    await product.save();

    res
      .status(200)
      .json({ message: "Order updated successfully", data: order });
  } catch (error) {
    console.error("Error updating order:", error.message);
    res
      .status(500)
      .json({ message: "Failed to update order", error: error.message });
  }
});
app.delete("/api/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UsersModel.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await OrdersModel.deleteMany({ userId });

    res
      .status(200)
      .json({ message: "User and related orders deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res
      .status(500)
      .json({ message: "Failed to delete user", error: error.message });
  }
});

app.listen(8080, () => {
  console.log("Server is running!");
});
