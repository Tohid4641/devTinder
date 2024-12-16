const express = require('express');
const connectDB = require('./configs/database');
const cookieParser = require('cookie-parser');
const router = require('./routes/index.routes');
const apiLogger = require('./utils/apiLogger');
const globalErrorHandler = require('./utils/globalErrorHandler');

const app = express();
const port = 7777;

app.use(express.json());
app.use(cookieParser());
app.use(apiLogger);

app.use('/api', router)

app.use(globalErrorHandler);
  

connectDB()
    .then(() => {
        console.log("Database connected!!");
        app.listen(port, () => console.log(`devTinder backend server is listening on ::: http://localhost:${port}`));
    })
    .catch((err) => {
        console.error("Database connection failed!!")
        console.error(err.message)
    })
