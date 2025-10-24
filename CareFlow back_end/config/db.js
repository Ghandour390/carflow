const mongoose = require("mongoose");

async function connectToMongoDB() {
  try {
    const mongoURI = process.env.MONGO_URI || `mongodb://${process.env.MONGODB_SERVER || 'localhost'}:${process.env.MONGODB_PORT || '27018'}/careflow`; // Utilise les variables d'environnement avec fallback

    await mongoose.connect(mongoURI);

    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1); // Quitte le serveur si la connexion échoue
  }


  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected');
  });
}

module.exports = connectToMongoDB;
