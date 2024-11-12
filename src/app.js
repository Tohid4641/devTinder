const express = require('express');
const connectDB = require('./configs/database');
const User = require('./models/user');
const validators = require('./utils/validators');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');

const app = express();
const port = 7777;

app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res, next) => {
    try {
        validators.signupValidator(req.body);

        const hashPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            ...req.body,
            password: hashPassword
        });

        await user.save();
        res.status(201).send("signup successfull!");
    } catch (error) {
        next(error)
    }
});

app.post('/login', async (req, res, next) => {
    try {
        validators.loginValidator(req.body);

        const { emailId, password } = req.body;

        const user = await User.findOne({emailId});

        if(!user) throw new Error("Invalid credentials");

        const isPasswordValid = await user.validatePassword(password);

        if(!isPasswordValid) throw new Error("Invalid credentials");

        const token = await user.getJWT();

        res.cookie('token', token);

        res.status(200).send("login successfull!");
    } catch (error) {
        next(error)
    }
});

app.get('/user/profile',userAuth, async (req, res, next) => {
    const user = req.user;

    try {
        
        res.status(200).send(user);
    } catch (error) {
        next(error)
    }
});

app.post('/user/send-connection-req',userAuth, async (req, res, next) => {
    const user = req.user;

    try {
        
        res.status(200).send(user.firstName +' '+ user.lastName + ' is sent you a connection request!');
    } catch (error) {
        next(error)
    }
});

app.get('/user', async (req, res, next) => {
    try {
        const user = await User.findOne({ emailId: req.body.emailId });
        if (!user) {
            res.status(404).send("User not found!");
        }
        res.status(200).send(user);
    } catch (error) {
        next(error)
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

app.patch('/user/:userId', async (req, res) => {
    const userId = req.params?.userId;
    const newData = req.body

    try {
        await User.findByIdAndUpdate({ _id: userId }, newData,
            {
                runValidators:true
            }
        );
        res.status(200).send("user updated successfully");
    } catch (error) {
        res.status(error.statusCode || 500).send(error.message)
    }

})

// Middleware to handle Mongoose validation errors
app.use((err, req, res, next) => {

    if (err.name === 'ValidationError') {
      const errors = Object.keys(err.errors).reduce((acc, field) => {
        acc[field] = err.errors[field].message;
        return acc;
      }, {});
      return res.status(400).json({ message: 'Validation failed', errors });
    }
  
    if (err.code === 11000) {
      // Handle unique constraint errors, like duplicate email
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ message: `Duplicate value for ${field}.` });
    }
  
    return res.status(err.statusCode || 500).json({
        message: err.message || 'Somthing Went Wrong!'
    })
  });
  

connectDB()
    .then(() => {
        console.log("Database connected!!");
        app.listen(port, () => console.log(`devTinder backend server is listening on ::: http://localhost:${port}`));
    })
    .catch((err) => {
        console.error("Database connection failed!!")
        console.error(err.message)
    })
