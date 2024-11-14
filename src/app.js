const express = require('express');
const connectDB = require('./configs/database');
const cookieParser = require('cookie-parser');
const router = require('./routes/index.routes');
const apiLogger = require('./utils/apiLogger');

const app = express();
const port = 7777;

app.use(express.json());
app.use(cookieParser());
app.use(apiLogger);

app.use('/api', router)

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
