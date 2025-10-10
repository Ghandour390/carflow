const mongoose = require("mongoose");




// app.use(express.urlencoded({ extended: true }));

// mongodb://user:password@localhost:27017/mydatabase?authSource=admin

async function connectToMongoDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/careflow', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB avec seccess');
        
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}
// const mongooseUrl ='mongodb://localhost:27017/careflow';
// const connexiondb=mongoose.connect(mongooseUrl || process.env.MONGO_URL)
//     .then(() => console.log('Connected to MongoDB avec success'))
//     .catch(err => console.error('Error connecting to MongoDB:', err));



    module.exports = connectToMongoDB;