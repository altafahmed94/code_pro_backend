const express = require('express');

const ctfController = require('./../controllers/ctfController');
const contestController = require('./../controllers/contestController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/createContest')
  .get(authController.protect, contestController.createContest);

// router.post('/signup', authController.signup);
// router.post('/login', authController.login);
// router.post('/logout', authController.logout);
// router.post('/make-friend', authController.protect, userController.makeFriend);
// router.post(
//   '/accept-request',
//   authController.protect,
//   userController.responseToFriendRequest
// );

module.exports = router;
