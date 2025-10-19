const mongoose = require("mongoose");

async function connectToMongoDB() {
  try {
    const mongoURI =  'mongodb://localhost:27017/careflow';
    //  process.env.MONGO_URL ||

    await mongoose.connect(mongoURI);

    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1); // Quitte le serveur si la connexion échoue
  }

  // Optionnel : pour afficher un message en cas de déconnexion
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected');
  });
}

module.exports = connectToMongoDB;
