const express = require('express');
const reportController = require('./../controllers/reportController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post(
  '/report-discussion',
  authController.protect,
  reportController.reportDiscussion
);

router.post(
  '/resolve-discussion',
  authController.protect,
  reportController.resolveReport
);

module.exports = router;
