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
            await createThoughtData.save()
            const user = await User.findOneAndUpdate(
                { username: req.body.username },
                { $addToSet: { thoughts: createThoughtData._id } },
                { new: true }
            )

            if (!user) {
                res.status(404).json({ message: 'Thought created but found not user whit that id!!!' })
            }

            res.json('Thought created');
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // update Thought by id
    async updateThought(req, res) {
        try {
            const updateThoughtData = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!updateThoughtData) {
                res.status(404).json({ message: 'No Thought with that id!' });
            }

            res.json(updateThoughtData);

        } catch (err) {
            res.status(500).json(err);
        }
    },

    // delete a Thought by id
    async deleteThought(req, res) {
        try {
            const deleteThoughtData = await Thought.findOneAndDelete({ _id: ObjectId(req.params.thoughtId) });

            await User.findOneAndUpdate(
                { _id: ObjectId(req.params.userId) },
                { $pull: { thoughts: ObjectId(req.params.thoughtId) } },
                { new: true }
            )
            
            if (!deleteThoughtData) {
                res.status(404).json({ message: 'No Thought with that id! ' })
            }

            res.json({ message: 'Thought deleted!!!' });

        } catch (err) {
            res.status(500).json(err);
        }
    },

    // create a new Reaction
    async createReaction(req, res) {
        try {
            const createReactionData = await Thought.findOneAndUpdate(
                { _id: ObjectId(req.params.thoughtId) },
                { $addToSet: { reactions: 
                    { reactionBody: req.body.reactionBody, username: req.body.username },
                    
                } }
            )

            if (!createReactionData) {
                res.status(404).json({ message: 'Reaction created but found not thought whit that id!!!' })
            }

            res.json(createReactionData);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // delete a Reaction
    async deleteReaction(req, res) {
        try {
            const deleteReactionData = await Thought.findOneAndUpdate(
                { _id: ObjectId(req.params.thoughtId) },
                { $pull: { reactions: {_id: ObjectId(req.params.reactionId)} } },
                { new: true }
            )

            if(!deleteReactionData) {
                res.status(404).json({ message: 'No reaction found' })
            }

            res.json(deleteReactionData)

        } catch (err) {
            res.status(500).json(err);
        }
    },
}