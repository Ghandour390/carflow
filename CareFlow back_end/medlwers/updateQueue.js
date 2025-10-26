const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Durée maximale de traitement (en secondes)
const PROCESSING_TIMEOUT = 30;

const updateQueue = async (req, res, next) => {
    const resourceType = req.baseUrl.split('/')[2]; // Exemple: /api/analyses -> analyses
    const resourceId = req.params.disponibiliteId || req.params.id;
    // Format de clé : nomModule:id (exemple: rendezVous:123)
    const resourceKey = `${resourceType}:${resourceId}`;
    const userId = req.user._id;

    try {
        // Vérifier si l'utilisateur a déjà une requête en attente pour cette ressource
        const requestKey = `${resourceKey}:requests`;
        const userRequests = await redis.lrange(requestKey, 0, -1);
        
        if (userRequests.includes(userId)) {
            return res.status(409).json({
                message: `Vous avez déjà une requête en attente pour ${resourceType} #${resourceId}`
            });
        }

        // Vérifier si la ressource est en cours de modification
        const inProgressKey = `${resourceKey}:inProgress`;
        const currentModifier = await redis.get(inProgressKey);
        
        if (currentModifier && currentModifier !== userId) {
            // Ajouter la requête à la file d'attente
            await redis.rpush(requestKey, userId);
            // Stocker les détails de la requête
            const requestDetailsKey = `${resourceKey}:${userId}:details`;
            await redis.hmset(requestDetailsKey, {
                'userId': userId,
                'timestamp': Date.now(),
                'operation': req.method,
                'requestPath': req.path
            });
            await redis.expire(requestDetailsKey, PROCESSING_TIMEOUT);

            const position = userRequests.length + 1;
            return res.status(409).json({
                message: `${resourceType} #${resourceId} est en cours de modification. Votre requête a été mise en file d'attente.`,
                position: position,
                resourceKey: resourceKey
            });
        }

        // Obtenir la prochaine requête dans la file
        const nextRequest = await redis.lpop(requestKey);

        if (nextRequest && nextRequest !== userId) {
            // Remettre la requête au début de la file
            await redis.lpush(requestKey, nextRequest);
            // Ajouter la nouvelle requête à la fin
            await redis.rpush(requestKey, userId);
            
            const position = userRequests.length + 1;
            return res.status(409).json({
                message: "Veuillez attendre votre tour dans la file d'attente.",
                position: position,
                resourceKey: resourceKey
            });
        }

        // Marquer la ressource comme en cours de modification
        await redis.set(inProgressKey, userId, 'EX', PROCESSING_TIMEOUT);

        // Stocker les détails de l'opération en cours
        const operationKey = `${resourceKey}:operation`;
        await redis.hmset(operationKey, {
            'userId': userId,
            'startTime': Date.now(),
            'operation': req.method,
            'status': 'in_progress'
        });
        await redis.expire(operationKey, PROCESSING_TIMEOUT);

        // Nettoyer après la réponse
        res.on('finish', async () => {
            try {
                await redis.del(inProgressKey);
                await redis.del(operationKey);
                
                // Vérifier la prochaine requête en attente
                const nextInQueue = await redis.lindex(requestKey, 0);
                if (nextInQueue) {
                    const nextDetailsKey = `${resourceKey}:${nextInQueue}:details`;
                    const details = await redis.hgetall(nextDetailsKey);
                    console.log(`Prochaine requête pour ${resourceKey}:`, details);
                }
            } catch (error) {
                console.error(`Erreur lors du nettoyage de la file d'attente pour ${resourceKey}:`, error);
            }
        });

        next();
    } catch (error) {
        console.error('Erreur lors de la gestion de la file d\'attente:', error);
        return res.status(500).json({
            message: "Une erreur est survenue lors de la gestion de la concurrence"
        });
    }
};

module.exports = updateQueue;