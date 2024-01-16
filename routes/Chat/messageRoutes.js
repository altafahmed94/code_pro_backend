const express = require("express");
// const chatController = require("../controllers/chatController");
const authController = require("./../../controllers/authController");
const messageController = require("./../../controllers/Chat/messageController");

const router = express.Router();

router.route("/").post(authController.protect, messageController.sendMessage);
router
  .route("/:chatId")
  .get(authController.protect, messageController.getAllMessage);

router
  .route("/vote/:id")
  .post(authController.protect, messageController.doVotes);

module.exports = router;
