const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log('Connected to MongoDB');
        await mongoose.connection.db.collection('users').deleteMany({});
        console.log('All users deleted');
        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
