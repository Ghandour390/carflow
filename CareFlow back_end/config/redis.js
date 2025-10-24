const redis = require('redis');

const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379' // Utilise REDIS_URL de .env.docker ou un fallback local
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));


module.exports = redisClient;