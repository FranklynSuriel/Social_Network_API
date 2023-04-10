const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
    // get all thoughts
    async getAllThoughts(req, res) {
        try {
            const allThoughtsData = await Thought.find();

            res.json(allThoughtsData);

        } catch (err) {
            res.status(500).json(err);
        }
    },

    // get a single Thought by id
    async getSingleThought(req, res) {
        try {
            const singleThoughtData = await Thought.findOne({ _id: req.params.thoughtId })
                .select('-__v')

            // send an error message if thought id does not exist
            if (!singleThoughtData) {
                return res.status(404).json({ message: 'No Thought with that id!' });
            }

            res.json(singleThoughtData)

        } catch (err) {
            res.status(500).json(err);
        }
    },

    // create a new Thought
    async createThought(req, res) {
        try {            
            const createThoughtData = await Thought.create(req.body);

            // save the thought data
            await createThoughtData.save()
            // and then find the user that created the thought and update the user
            const user = await User.findOneAndUpdate(
                { username: req.body.username },
                { $addToSet: { thoughts: createThoughtData._id } },
                { new: true }
            )

            // send an error message if user id does not exist
            if (!user) {
                res.status(404).json({ message: 'Thought created but found not user whit that id!!!' })
                return;
            }

            res.json(createThoughtData);

        } catch (err) {
            res.status(500).json(err);
        }
    },

    // update Thought by id
    async updateThought(req, res) {
        try {
            // find the thought by id and update it
            const updateThoughtData = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            // send an error message if thought id does not exist
            if (!updateThoughtData) {
                res.status(404).json({ message: 'No Thought with that id!' });
                return;
            }

            res.json(updateThoughtData);

        } catch (err) {
            res.status(500).json(err);
        }
    },

    // delete a Thought by id
    async deleteThought(req, res) {
        try {
            // find the thought by id and delete it
            const deleteThoughtData = await Thought.findOneAndDelete({ _id: ObjectId(req.params.thoughtId) });
            // await to get the user and erase the thought id
            await User.findOneAndUpdate(
                { username: deleteThoughtData.username },
                { $pull: { thoughts: req.params.thoughtId } },
                { new: true }
                )
            
            // send an error message if thought id does not exist
            if (!deleteThoughtData) {
                res.status(404).json({ message: 'No Thought with that id! ' })
                return;
            }

            res.json({ message: 'Thought deleted!!!' });

        } catch (err) {
            res.status(500).json(err);
        }
    },

    // create a new Reaction
    async createReaction(req, res) {
        try {
            // create a thought reaction and update the thought
            const createReactionData = await Thought.findOneAndUpdate(
                { _id: ObjectId(req.params.thoughtId) },
                { $addToSet: { reactions: 
                    { reactionBody: req.body.reactionBody, username: req.body.username },
                    
                } },
                { new: true }
            )

            // send an error message if thought id does not exist
            if (!createReactionData) {
                res.status(404).json({ message: 'Reaction created but found not thought whit that id!!!' })
                return;
            }

            res.json(createReactionData);

        } catch (err) {
            res.status(500).json(err);
        }
    },

    // delete a Reaction
    async deleteReaction(req, res) {
        try {
            // delete a reaction and update the thought
            const deleteReactionData = await Thought.findOneAndUpdate(
                { _id: ObjectId(req.params.thoughtId) },
                { $pull: { reactions: {_id: ObjectId(req.params.reactionId)} } },
                { new: true }
            )

            // send an error message if reaction id does not exist
            if(!deleteReactionData) {
                res.status(404).json({ message: 'No reaction found' })
                return;
            }

            res.json(deleteReactionData)

        } catch (err) {
            res.status(500).json(err);
        }
    },
}