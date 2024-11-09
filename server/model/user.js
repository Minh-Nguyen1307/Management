import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    age: { type: Number, min: 0 }
});

const UsersModel = mongoose.model('User', userSchema);
export default UsersModel;
