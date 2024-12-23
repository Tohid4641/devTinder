const express = require("express");
const connectDB = require("./configs/database");
const cookieParser = require("cookie-parser");
const router = require("./routes/index.routes");
const apiLogger = require("./utils/apiLogger");
const cors = require("cors");
const globalErrorHandler = require("./utils/globalErrorHandler");

const app = express();
const port = 7777;

app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
app.use(express.json());
app.use(cookieParser());

app.use(apiLogger);

app.use("/api", router);
app.use('/*', (req, res)=> {
    return res.status(404).json({
        success: false,
        message: 'Invalid API Call!!',
    })
})

app.use(globalErrorHandler);

connectDB()
  .then(() => {
    console.log("Database connected!!");
    app.listen(port, () =>
      console.log(
        `devTinder backend server is listening on ::: http://localhost:${port}`
      )
    );
  })
  .catch((err) => {
    console.error("Database connection failed!!");
    console.error(err.message);
  });
