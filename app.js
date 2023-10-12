const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const globalError = require("./controller/error");
const { swaggerUi, swaggerSpec } = require("./config/swagger");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");

const app = express();

// middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(compression());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// unhandled routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "success",
    message: `cannot find ${req.originalUrl} in the server`,
  });
});

app.use(globalError);

module.exports = app;
