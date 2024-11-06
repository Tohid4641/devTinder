const express = require('express');
const connectDB = require('./configs/database');
const User = require('./models/user');

const app = express();
const port = 7777;

app.use(express.json());

app.post('/signup', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(200).send("signup successfull!");
    } catch (error) {
        res.status(error.statusCode || 500).json(error.message)
    }
});

app.get('/user', async (req, res) => {
    try {
        const user = await User.findOne({ emailId: req.body.emailId });
        if (!user) {
            res.status(404).send("User not found!");
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(error.statusCode || 500).send(error.message)
    }
});

app.get('/feed', async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length === 0) {
            res.status(404).send('Users not found!')
        }
        res.status(200).send(users);
    } catch (error) {
        res.status(error.statusCode || 500).send(error.message)
    }
});

app.delete('/user', async (req, res) => {
    const userId = req.body.userId;
    try {
        await User.findByIdAndDelete(userId);
        res.status(200).send("user deleted successfully");
    } catch (error) {
        res.status(error.statusCode || 500).send(error.message)
    }

})

app.patch('/user', async (req, res) => {
    const userId = req.body.userId;
    const newData = req.body

    try {
        await User.findByIdAndUpdate({ _id: userId }, newData);
        res.status(200).send("user updated successfully");
    } catch (error) {
        res.status(error.statusCode || 500).send(error.message)
    }

})


connectDB()
    .then(() => {
        console.log("Database connected!!");
        app.listen(port, () => console.log(`devTinder backend server is listening on ::: http://localhost:${port}`));
    })
    .catch((err) => {
        console.error("Database connection failed!!")
        console.error(err.message)
    })
