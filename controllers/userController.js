const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
    // get all users
    async getAllUsers(req, res) {
        try {
            const allUserData = await User.find();
            res.json(allUserData);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // get a single user by id
    async getSingleUser(req, res) {
        try {
            const singleUserData = await User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate('thoughts', 'friends')

            if (!singleUserData) {
                return res.status(404).json({ message: 'No user with that id!' });
            }

            res.json(singleUserData)

        } catch(err) {
            res.status(500).json(err);
        }
    },

    // create a new user
    async createUser(req, res) {
        try{
            const createUserData = await User.create(req.body);
            res.json(createUserData);

        }catch(err) {
            res.status(500).json(err);
        }
    },

    // update User by id
    async updateUser(req, res) {
        try {
            const updateUserData = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!updateUserData) {
                res.status(404).json({ message: 'No user with that id!' });
            }

            res.json(updateUserData);

        } catch(err) {
            res.status(500).json(err);
        }
    },

    // delete a user by id
    async deleteUser(req, res) {
        try {
            const deleteUserData = await User.findOneAndDelete({ _id: req.params.userId });

            if (!deleteUserData) {
                res.status(404).json({ message: 'No user with that id! '})
            }

            await Thought.deleteMany({ _id: { $in: user.thoughts } });
            res.json({ message: 'User and thoughts deleted!!!' });

        }catch(err) {
            res.status(500).json(err);
        }
    }
}