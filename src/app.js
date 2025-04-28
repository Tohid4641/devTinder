const express = require("express");
const connectDB = require("./configs/database");
const cookieParser = require("cookie-parser");
const router = require("./routes/index.routes");
const apiLogger = require("./utils/apiLogger");
const cors = require("cors");
const globalErrorHandler = require("./utils/globalErrorHandler");
const http = require("http");
const initializeSocket = require("./utils/socket");

const app = express();
const port = process.env.PORT || 7777;
const NODE_ENV = process.env.NODE_ENV || 'development';
const BASE_URL = NODE_ENV === 'production' 
  ? 'http://devtinder.in/api'
  : `http://localhost:${port}`;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(apiLogger);
const server = http.createServer(app);

app.use("/api", router);
app.use('/*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'Invalid API Call!!',
  })
})

initializeSocket(server);

app.use(globalErrorHandler);

connectDB()
  .then(() => {
    console.log("Database connected!!");
    server.listen(port, () =>
      console.log(
        `devTinder backend server is listening on ::: ${BASE_URL}`
      )
    );
  })
  .catch((err) => {
    console.error("Database connection failed!!");
    console.error(err.message);
  });
