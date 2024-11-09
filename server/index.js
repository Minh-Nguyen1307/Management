import express from 'express';
import mongoose from 'mongoose';



mongoose.connect('mongodb+srv://minhnguyen1307s2:0V9Y6nID4K75w3l0@management.byc0z.mongodb.net/?retryWrites=true&w=majority&appName=Management');
const app = express();

app.use(express.json());

app.post('/api/users', async (req, res) => {
    try {
        const { userName, email, age } = req.body;
        const existingUser = await UsersModel.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: 'Email already in use'})
        };
        
        const newUser = new UsersModel({userName, email, age});
        const savedUser = await newUser.save();
        res.status(201).json({message:'User created successfully', data: savedUser})
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).json({ message: 'Failed to create user', error: error.message });
    }
});

app.listen(8080, () => {
    console.log('Server is running!');
});