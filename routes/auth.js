var express = require("express");
var router = express.Router();

const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controller/auth");
const { isAuth } = require("../middlewares/isAuth");

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     tags:
 *       - Authentication
 *     description: Create a new user account.
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             phone:
 *               type: number
 *             email:
 *               type: string
 *             password:
 *               type: string
 *             confirmPassword:
 *               type: string
 *           required:
 *             - firstName
 *             - lastName
 *             - phone
 *             - email
 *             - password
 *             - confirmPassword
 *     responses:
 *       201:
 *         description: Successfully created a new user account.
 *       400:
 *         description: Bad request. Invalid input data.
 *       500:
 *         description: Internal server error.
 */
router.route("/signup").post(signUp);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     description: Log in to an existing user account.
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *           required:
 *             - email
 *             - password
 *     responses:
 *       200:
 *         description: Successfully logged in.
 *       401:
 *         description: Unauthorized. Invalid credentials.
 *       500:
 *         description: Internal server error.
 */
router.route("/login").post(login);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     tags:
 *       - Authentication
 *     description: Request to reset a forgotten password.
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *           required:
 *             - email
 *     responses:
 *       200:
 *         description: Password reset email sent.
 *       400:
 *         description: Bad request. Invalid input data.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.route("/forgot-password").post(forgotPassword);

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   patch:
 *     tags:
 *       - Authentication
 *     description: Reset the password using a token received via email.
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         type: string
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             password:
 *               type: string
 *             confimPassword:
 *               type: string
 *           required:
 *             - password
 *             - confimPassword
 *     responses:
 *       200:
 *         description: Password successfully reset.
 *       400:
 *         description: Bad request. Invalid input data.
 *       404:
 *         description: Token is invalid or has expired.
 *       500:
 *         description: Internal server error.
 */
router.route("/reset-password/:token").patch(resetPassword);

/**
 * @swagger
 * /auth/update-password:
 *   patch:
 *     tags:
 *       - Users
 *     description: Update the user's password.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             currentPassword:
 *               type: string
 *             newPassword:
 *               type: string
 *           required:
 *             - currentPassword
 *             - newPassword
 *     responses:
 *       200:
 *         description: Password successfully updated.
 *       400:
 *         description: Bad request. Invalid input data.
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       500:
 *         description: Internal server error.
 */
router.route("/update-password").patch(isAuth, updatePassword);

module.exports = router;
