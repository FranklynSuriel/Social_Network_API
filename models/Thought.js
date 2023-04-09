const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

//Schema to create User model;
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (date) => {
                return {
                    format_time: date.toLocaleTimeString(),
                    format_date: `${
                        new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(date).getFullYear()}`
                }
            }
        },
        username: {
                type: String,
                required: true
        },        
        reactions: [ reactionSchema ],
    },
    {
        toJSON: {
            virtuals: true,            
        },
        id: false,
    }
);

thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

const Thought = model('thought', thoughtSchema);

module.exports = Thought;