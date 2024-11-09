import mongoose from 'mongoose';
import Collection from '../database/collection.js';

const productsSchema = new mongoose.Schema({
    productName: {type: String, require: true},
    stock: { type: Number, required: true, min: 0 },
    price: { type: Number,required: true, min: 0 },
});

const ProductsModel = mongoose.model(Collection.PRODUCTS, productsSchema);
export default ProductsModel;
