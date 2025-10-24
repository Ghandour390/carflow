const multer = require('multer');

// Configuration de Multer pour stocker les fichiers en mémoire
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 20 * 1024 * 1024 // 20MB par défaut
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = (process.env.ALLOWED_DOCUMENT_TYPES || 'application/pdf,image/jpeg,image/png').split(',');
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Type de fichier non autorisé'), false);
        }
    }
});

// Middleware pour gérer les erreurs de téléchargement
const handleUploadErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'Le fichier dépasse la taille maximale autorisée'
            });
        }
    }
    if (err.message === 'Type de fichier non autorisé') {
        return res.status(400).json({
            message: err.message
        });
    }
    next(err);
};

module.exports = {
    upload,
    handleUploadErrors
};