// Require necessary packages and routes
const { ObjectId } = require('mongoose').Types;
const { User, Thought, Reaction } = require('../models');
const thoughtController = require('./thoughtController');

module.exports = {
    // get all users
    async getAllUsers(req, res) {
        try {
            const allUserData = await User.find()
            // Send a error message if invalid user data
            if (!allUserData) {
                return res.send(404).json({ message: 'No user created at this moment' })
            }

            res.json(allUserData);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // get a single user by id and populate thoughts and friends
    async getSingleUser(req, res) {
        try {
            const singleUserData = await User.findOne({ _id: ObjectId(req.params.userId) })                
                .select('-__v')
                .populate('thoughts')
                .populate('friends')
            
            // send an error message if user id does not exist
            if (!singleUserData) {
                return res.status(404).json({ message: 'No user with that id!' })
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
            // send an error message if user id does not exist 
            if (!updateUserData) {
                res.status(404).json({ message: 'No user with that id!' })
                return;
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

            // send an error message if user id does not exist
            if (!deleteUserData) {
                res.status(404).json({ message: 'No user with that id! ' })
                return ;
            }
            // get all the thoughts relate to the user and delete
            await Thought.deleteMany({ username: deleteUserData.username });

            res.json('User and thoughts deleted!!!');

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
            // send an error message if user id does not exist
            if (!addFriendData) {
                res.status(404).json({ message: 'Friend or User does not exist!!' })
                return;
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
            
            // send an error message if friend id does not exist
            if (!deleteFriendData) {
                res.status(404).json({ message: 'No friend with that id! ' })
                return;
            }
            
            res.json(deleteFriendData);

        } catch (err) {
            res.status(500).json(err);
        }
    },
}