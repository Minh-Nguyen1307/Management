import mongoose from 'mongoose';
import Collection from '../database/collection.js';

const orderSchema = new mongoose.Schema({
    quantity: { type: Number, required: true },  
    price: { type: Number, required: true },  
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }, 
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },  
    productName: { type: String, required: true }, 
});

const OrdersModel = mongoose.model(Collection.ORDERS, orderSchema);

export default OrdersModel;
