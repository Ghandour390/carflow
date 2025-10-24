const express = require('express');
require('dotenv').config();
const connectToMongoDB = require('./config/db');
const redisClient = require('./config/redis');

// Import des routes
const userRoute = require('./routes/users');
const roleRoute = require('./routes/roles');
const documentRoute = require('./routes/documents');
// const specialiteRoute = require('./routes/specialites');
const rendezVous = require('./routes/rendezVous');
const dossierMedicalRoute = require('./routes/dossiersMedical');
const consultationRoute = require('./routes/consultations');
const ordonnanceRoute = require('./routes/ordonnances');

const app = express();
const port = process.env.PORT || 3000; // Utilise la variable d'environnement PORT, ou 3000 par défaut

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to attach the redis client to each request
app.use((req, res, next) => {
  req.redis = redisClient;
  next();
});

// Route de test
app.get('/', (req, res) => {
  res.send('Hello World!');
});

const startServer = async () => {
  try {
  
    await connectToMongoDB();
    await redisClient.connect();
    console.log('✅ Connected to Redis successfully');

    // Routes
    app.use('/api/users', userRoute);
    app.use('/api/roles', roleRoute);
    app.use('/api/rendezVous', rendezVous);
    app.use('/api/dossiers-medicaux', dossierMedicalRoute);
    app.use('/api/consultations', consultationRoute);
    app.use('/api/ordonnances', ordonnanceRoute);

    // app.use('/api/specialites', specialiteRoute);
    app.use('/api/documents', documentRoute);

  
    app.listen(port, () => {
      console.log(`Server is running on port ${port} http://localhost:${port}`);
    });
  } catch (error) {
    console.error(' Failed to connect to the database', error);
    process.exit(1);
  }
};



startServer();
