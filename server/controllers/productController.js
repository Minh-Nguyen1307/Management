import ProductsModel from "../models/products.js";

export const createProduct = async (req, res) => {
  try {
    const { productName, stock, price } = req.body;
    const existingProductName = await ProductsModel.findOne({ productName });
    if (existingProductName) {
      return res.status(400).json({ message: "Product already in use" });
    }
    const newProduct = new ProductsModel({ productName, stock, price });
    const savedProduct = await newProduct.save();
    res.status(201).json({ message: "Product created successfully", data: savedProduct });
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};