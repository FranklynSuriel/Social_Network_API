const { ObjectId } = require('mongoose').Types;
const { User, Thought, Reaction } = require('../models');

module.exports = {
    // get all users
    async getAllUsers(req, res) {
        try {
            const allUserData = await User.find()
                // .populate({ path: 'friends', select: '-__v' })
            if (!allUserData) {
                return res.send(404).json({ message: 'No user created at this moment' })
            }

            res.json(allUserData);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // get a single user by id
    async getSingleUser(req, res) {
        try {
            const singleUserData = await User.findOne({ _id: ObjectId(req.params.userId) })                
                .select('-__v')
                .populate('thoughts')
                .populate('friends')
            
            if (!singleUserData) {
                return res.status(404).json({ message: 'No user with that id!' });
            }

            res.json(singleUserData || singleFriend)

        } catch (err) {
            res.status(500).json(err);
        }
    },

    // create a new user
    async createUser(req, res) {
        try {
            const createUserData = await User.create(req.body);
            res.json(createUserData);

        } catch (err) {
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

        } catch (err) {
            res.status(500).json(err);
        }
    },

    // delete a user by id
    async deleteUser(req, res) {
        try {
            const deleteUserData = await User.findOneAndDelete({ _id: req.params.userId });

            if (!deleteUserData) {
                res.status(404).json({ message: 'No user with that id! ' })
                return
            }
            
            await Thought.deleteMany({ username: deleteUserData.username });

            res.json({ message: 'User and thoughts deleted!!!' });

        } catch (err) {
            res.status(500).json(err);
        }
    },

    // add a new friend by id
    async addFriend(req, res) {
        try {
            const addFriendData = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { new: true } 
            )

            if (!addFriendData) {
                res.status(404).json({ message: 'Friend or User does not exist!!' })
            }

            res.json(addFriendData);

        } catch (err) {
            res.status(500).json(err);
        }
    },

    // delete a friend by id
    async deleteFriend(req, res) {
        try {
            const deleteFriendData = await User.findOneAndUpdate(
                { _id: ObjectId(req.params.userId) },
                { $pull: { friends: ObjectId(req.params.friendId) } },
                { new: true }
            );

            if (!deleteFriendData) {
                res.status(404).json({ message: 'No friend with that id! ' })
            }
            
            res.json(deleteFriendData);

        } catch (err) {
            res.status(500).json(err);
        }
    },
}