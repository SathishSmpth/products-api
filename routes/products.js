var express = require("express");
var router = express.Router();

const {
  newProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/products");
const upload = require("../config/multer.config");
const { upload_single_file } = require("../controller/uploadImageController");
const { isAuth } = require("../middlewares/isAuth");
/**
 * @swagger
 * securityDefinitions:
 *   BearerAuth:
 *     type: apiKey
 *     in: header
 *     name: Authorization
 *     description: Use Bearer token to authenticate.
 */
/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     description: Get a list of all products.
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of products.
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       500:
 *         description: Internal server error.
 */
router.route("/").get(getAllProducts);

/**
 * @swagger
 * /products:
 *   post:
 *     tags:
 *       - Products
 *     description: Create a new product.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product.
 *               description:
 *                 type: string
 *                 description: The description of the product.
 *               price:
 *                 type: number
 *                 description: The price of the product.
 *             required:
 *               - name
 *               - price
 *     responses:
 *       201:
 *         description: Successfully created a new product.
 *       400:
 *         description: Bad request. Invalid input data.
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       500:
 *         description: Internal server error.
 */
router
  .route("/")
  .post(isAuth, upload.single("image"), upload_single_file, newProduct);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     description: Get a product by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         required: true
 *         description: The ID of the product to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the product.
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 *
 *   put:
 *     tags:
 *       - Products
 *     description: Update a product by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         required: true
 *         description: The ID of the product to update.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully updated the product.
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 *
 *   delete:
 *     tags:
 *       - Products
 *     description: Delete a product by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         required: true
 *         description: The ID of the product to delete.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Successfully deleted the product.
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */
router
  .route("/:id")
  .get(getProduct)
  .put(isAuth, updateProduct)
  .delete(isAuth, deleteProduct);

module.exports = router;
