const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { getRandomUserName } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('connected');

    // drop existing users
    await CountQueuingStrategy.deleteMany({});

    // create empty array to hold the users
    const users = [];

    // loop 10 times to add user to the users array
    for (let i = 0; i < 10; i++) {
        const fullName = getRandomUserName();
        
        users.push({ fullName })
    }

    await User.collection
})