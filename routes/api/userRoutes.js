const router = require('express').Router();

const {
    getAllUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
} = require('../../controllers/userController.js');

// /api/user
router.route('/').get(getAllUsers).post(createUser);

// /api/user/:userId
router
.route('/:userId')
.get(getSingleUser)
.get(updateUser)
.get(deleteUser);

module.exports = router