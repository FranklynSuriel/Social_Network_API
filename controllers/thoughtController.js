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
            const singleThoughtData = await Thought.findOne({ _id: req.params.ThoughtId })
            .select('-__v')
            
            if (!singleThoughtData) {
                return res.status(404).json({ message: 'No Thought with that id!' });
            }

            res.json(singleThoughtData)

        } catch(err) {
            res.status(500).json(err);
        }
    },

    // create a new Thought
    async createThought(req, res) {
        try{
            const createThoughtData = await Thought.create(req.body);
            res.json(createThoughtData);

        }catch(err) {
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

        } catch(err) {
            res.status(500).json(err);
        }
    },

    // delete a Thought by id
    async deleteThought(req, res) {
        try {
            const deleteThoughtData = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

            if (!deleteThoughtData) {
                res.status(404).json({ message: 'No Thought with that id! '})
            }

            res.json({ message: 'Thought and thoughts deleted!!!' });

        }catch(err) {
            res.status(500).json(err);
        }
    }
}