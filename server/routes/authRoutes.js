const express = require('express');
const { createUser, loginUserCtrl, getallUsers, getaUser, deleteaUser, updatedUser, blockUser, unBlockUser, handleRefreshToken, logout,updatePassword, forgotPassowrdToken, resetPassword } = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/register',createUser)
router.post('/forgot-password-token', forgotPassowrdToken)
router.put('/reset-password/:token', resetPassword)
router.put('/password',authMiddleware,updatePassword)
router.post('/login',loginUserCtrl)
router.get('/all-users', getallUsers)
router.get('/refresh',handleRefreshToken)
router.get('/logout',logout)
router.get('/:id',authMiddleware, isAdmin, getaUser)
router.delete('/:id', deleteaUser)
router.put('/edit-user',authMiddleware, updatedUser)
router.put('/block-user/:id',authMiddleware,isAdmin, blockUser)
router.put('/unblock-user/:id',authMiddleware,isAdmin, unBlockUser)

module.exports = router