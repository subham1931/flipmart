const express = require('express');
const { createUser, loginUserCtrl, getallUsers, getaUser, deleteaUser, updateaUser, updatedUser, blockUser, unBlockUser } = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/register',createUser)
router.post('/login',loginUserCtrl)
router.get('/all-users', getallUsers)
router.get('/:id',authMiddleware, isAdmin, getaUser)
router.delete('/:id', deleteaUser)
router.put('/edit-user',authMiddleware, updatedUser)
router.put('/block-user/:id',authMiddleware,isAdmin, blockUser)
router.put('/unblock-user/:id',authMiddleware,isAdmin, unBlockUser)

module.exports = router