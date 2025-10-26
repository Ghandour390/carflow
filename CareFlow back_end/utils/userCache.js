const redisClient = require('../config/redis');
const CACHE_TTL = 2 * 60 * 60;

/**
 * Stocke les données de l'utilisateur dans Redis
 * @param {string} userId - L'ID de l'utilisateur
 * @param {Object} userData - Les données de l'utilisateur à mettre en cache
 */
const cacheUser = async (userId, userData) => {
    try {
        const userCache = { ...userData };
        delete userCache.motDePasse; // Ne jamais mettre le mot de passe en cache
        await redisClient.setEx(`user:${userId}`, CACHE_TTL, JSON.stringify(userCache));
        console.log(`✅ Utilisateur ${userId} mis en cache dans Redis`);
    } catch (error) {
        console.warn(`⚠️ Erreur lors de la mise en cache de l'utilisateur ${userId}:`, error.message);
    }
};

/**
 * Récupère les données de l'utilisateur depuis Redis
 * @param {string} userId - L'ID de l'utilisateur
 * @returns {Object|null} Les données de l'utilisateur ou null si non trouvé
 */
const getCachedUser = async (userId) => {
    try {
        const cachedUser = await redisClient.get(`user:${userId}`);
        if (cachedUser) {
            return JSON.parse(cachedUser);
        }
    } catch (error) {
        console.warn(`⚠️ Erreur lors de la récupération du cache pour l'utilisateur ${userId}:`, error.message);
    }
    return null;
};

/**
 * Invalide le cache d'un utilisateur
 * @param {string} userId - L'ID de l'utilisateur
 */
const invalidateUserCache = async (userId) => {
    try {
        await redisClient.del(`user:${userId}`);
        console.log(`✅ Cache invalidé pour l'utilisateur ${userId}`);
    } catch (error) {
        console.warn(`⚠️ Erreur lors de l'invalidation du cache pour l'utilisateur ${userId}:`, error.message);
    }
};

module.exports = {
    cacheUser,
    getCachedUser,
    invalidateUserCache,
    CACHE_TTL
};