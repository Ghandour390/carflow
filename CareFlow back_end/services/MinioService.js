const Minio = require('minio');
const mime = require('mime-types');
const crypto = require('crypto');
// path was unused and removed to satisfy lint rules

class MinioService {
    constructor() {
        this.minioClient = new Minio.Client({
            endPoint: process.env.MINIO_ENDPOINT || 'localhost',
                port: parseInt(process.env.MINIO_PORT) || 9100,
            useSSL: process.env.MINIO_USE_SSL === 'true',
            accessKey: process.env.MINIO_ROOT_USER || 'admin',
            secretKey: process.env.MINIO_ROOT_PASSWORD || 'password'
        });

        this.buckets = {
            documents: process.env.MINIO_BUCKET_DOCUMENTS || 'careflow-documents',
            labReports: process.env.MINIO_BUCKET_LAB_REPORTS || 'careflow-lab-reports',
            prescriptions: process.env.MINIO_BUCKET_PRESCRIPTIONS || 'careflow-prescriptions'
        };

        this.allowedTypes = (process.env.ALLOWED_DOCUMENT_TYPES || 'application/pdf,image/jpeg,image/png').split(',');
        this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 20 * 1024 * 1024; // 20MB default
    }

    async initialize() {
        try {
            // Ensure all required buckets exist
            for (const bucketName of Object.values(this.buckets)) {
                const exists = await this.minioClient.bucketExists(bucketName);
                if (!exists) {
                    await this.minioClient.makeBucket(bucketName, process.env.MINIO_REGION || 'us-east-1');
                    console.log(`Created bucket: ${bucketName}`);
                }
            }
        } catch (error) {
            console.error('Error initializing MinIO buckets:', error);
            throw error;
        }
    }

    async uploadFile(bucketName, file, metadata = {}) {
        if (!this.allowedTypes.includes(file.mimetype)) {
            throw new Error('Type de fichier non autorisé');
        }

        if (file.size > this.maxFileSize) {
            throw new Error('Taille du fichier dépasse la limite autorisée');
        }

        const extension = mime.extension(file.mimetype);
        const fileName = `${crypto.randomUUID()}.${extension}`;

        await this.minioClient.putObject(
            bucketName,
            fileName,
            file.buffer,
            {
                'Content-Type': file.mimetype,
                ...metadata
            }
        );

        return {
            fileName,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            metadata
        };
    }

    async getFileUrl(bucketName, fileName, expirySeconds = 3600) {
        return await this.minioClient.presignedGetObject(bucketName, fileName, expirySeconds);
    }

    async deleteFile(bucketName, fileName) {
        await this.minioClient.removeObject(bucketName, fileName);
    }

    // Méthode spécifique pour les documents médicaux
    async uploadMedicalDocument(file, patientId, documentType, metadata = {}) {
        const enrichedMetadata = {
            ...metadata,
            patientId,
            documentType,
            uploadDate: new Date().toISOString()
        };

        return await this.uploadFile(
            this.buckets.documents,
            file,
            enrichedMetadata
        );
    }

    // Méthode spécifique pour les résultats d'analyses
    async uploadLabReport(file, patientId, consultationId, metadata = {}) {
        const enrichedMetadata = {
            ...metadata,
            patientId,
            consultationId,
            uploadDate: new Date().toISOString()
        };

        return await this.uploadFile(
            this.buckets.labReports,
            file,
            enrichedMetadata
        );
    }

    // Méthode spécifique pour les ordonnances
    async uploadPrescription(file, patientId, consultationId, metadata = {}) {
        const enrichedMetadata = {
            ...metadata,
            patientId,
            consultationId,
            uploadDate: new Date().toISOString()
        };

        return await this.uploadFile(
            this.buckets.prescriptions,
            file,
            enrichedMetadata
        );
    }

    // Recherche de fichiers par métadonnées
    async findFilesByMetadata(bucketName, metadataQuery) {
        const stream = this.minioClient.listObjects(bucketName, '', true);
        const files = [];

        for await (const file of stream) {
            const stat = await this.minioClient.statObject(bucketName, file.name);
            const matches = Object.entries(metadataQuery).every(
                ([key, value]) => stat.metaData[key] === value
            );

            if (matches) {
                files.push({
                    name: file.name,
                    size: file.size,
                    lastModified: file.lastModified,
                    metadata: stat.metaData
                });
            }
        }

        return files;
    }
}

// Export une instance unique du service
module.exports = new MinioService();