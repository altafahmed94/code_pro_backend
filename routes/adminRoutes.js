const express = require('express');
const authController = require('./../controllers/authController');
const adminController = require('./../controllers/adminController');
const reportController = require('./../controllers/reportController');

const router = express.Router();

router
  .route('/delete-discussion')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    adminController.deleteDiscussion
  );

router
  .route('/delete-message')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    adminController.deleteMessage
  );

router
  .route('/all-chats')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    adminController.allChats
  );

router
  .route('/all-reports')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    reportController.allReports
  );

module.exports = router;
