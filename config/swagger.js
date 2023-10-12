const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  info: {
    title: "Learn Node.js with Sathish",
    version: "1.0.0",
    description: "API documentation for Simple E-Com  Express.js application",
  },
  basePath: "/api/v1/",
  BearerAuth: {
    type: "apiKey",
    in: "header",
    name: "Authorization",
    description: 'Use "Bearer" token in the format: "Bearer your-jwt-token"',
  },
  definitions: {
    Product: {
      type: "object",
      properties: {
        title: { type: "string" },
        manufacture: { type: "string" },
        description: { type: "string" },
        price: { type: "number" },
        image: { type: "string" },
        createdBy: { type: "string" },
      },
    },
    User: {
      type: "object",
      properties: {
        firstName: { type: "string" },
        lastName: { type: "string" },
        phone: {
          type: "number",
          minimum: 1000000000,
          maximum: 9999999999,
        },
        email: { type: "string" },
        password: { type: "string" },
        confirmPassword: { type: "string" },
        passwordChangedAt: { type: "date" }, 
        passwordResetToken: { type: "string" },
        passwordResetExpiresIn: { type: "date" },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: [
    "./routes/products.js",
    "./routes/auth.js"
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };
