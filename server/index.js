import express from 'express';
import mongoose from 'mongoose';
import UsersModel from './model/user.js';


mongoose.connect('mongodb+srv://minhnguyen1307s2:0V9Y6nID4K75w3l0@management.byc0z.mongodb.net/?retryWrites=true&w=majority&appName=Management');
const app = express();

app.use(express.json());
app.post('/api/v1/users', async (req, res) => {
    try {
        const { userName, email } = req.body;
        if (!userName) throw new Error('userName is required!');
        if (!email) throw new Error('email is required!');
        
       
        const existedEmail = await UsersModel.findOne({
            email
        });
        if (existedEmail) throw new Error('Email already exists!');

        const createdUser = await UsersModel.create({
            userName,
            email
        });
        res.status(201).send({
            data: createdUser,
            message: 'Register successful!',
            success: true
        });
    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
});
app.delete('/api/v1/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        
        const user = await UsersModel.findById(id);
        if (!user) throw new Error('User not found!');

       
        await UsersModel.findByIdAndDelete(id);
        
        res.status(200).send({
            message: 'User deleted successfully!',
            success: true
        });
    } catch (error) {
        res.status(404).send({
            message: error.message,
            success: false
        });
    }
});
app.get('/api/v1/users/ids', async (req, res) => {
    try {
        // Retrieve all user IDs only
        const users = await UsersModel.find({}, '_id');

        // Map the result to an array of IDs
        const userIds = users.map(user => user._id);

        res.status(200).send({
            data: userIds,
            message: 'User IDs retrieved successfully!',
            success: true
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: null,
            success: false
        });
    }
});

app.listen(8080, () => {
    console.log('Server is running!');
});