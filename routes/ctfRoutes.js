const express = require('express');

const ctfController = require('./../controllers/ctfController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/').get(ctfController.allCtfs);
router
  .route('/createCtf')
  .post(authController.protect, ctfController.createCtf);
router
  .route('/submitFlag')
  .post(authController.protect, ctfController.flagSubmission);

router.route('/leaderboard').get(ctfController.ranking);
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
