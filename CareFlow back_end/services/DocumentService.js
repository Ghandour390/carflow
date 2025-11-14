const Document = require('../models/Document');
const DossierMedical = require('../models/DossierMedical');
// MinioService exports a singleton instance
const minioClient = require('./MinioService');

class DocumentService {
    
    async getDocuments(userId) {
        try {
            // Find all medical records for the user
            const dossiers = await DossierMedical.find({ patientId: userId });
            if (!dossiers.length) {
                return []; // No records found, return empty array
            }
            
            // Get the IDs of the medical records
            const dossierIds = dossiers.map(dossier => dossier._id);
            
            // Find all documents associated with those medical records
            const documents = await Document.find({ 'dossierMedicalId': { $in: dossierIds } });
            return documents;
        } catch (error) {
            throw new Error(`Error getting documents for user: ${error.message}`);
        }
    }

    
    async uploadDocument(file, typeDocument, dossierMedicalId, createurId) {
        try {
      
            const bucketName = 'documents';
            if (!createurId) {
                throw new Error('createurId (uploader user id) is required');
            }

            // Use MinioService.uploadFile which expects (bucketName, file)
            const uploadResult = await minioClient.uploadFile(bucketName, file);
            const objectName = uploadResult.fileName;

            const document = new Document({
                typeDocument,
                cheminFichier: objectName,
                dossierMedicalId,
                createurId
            });
            
            return await document.save();
        } catch (error) {
            throw new Error(`Error uploading document: ${error.message}`);
        }
    }


    async getDocumentsByDossier(dossierMedicalId) {
        try {
            const documents = await Document.find({ dossierMedicalId });
            return documents;
        } catch (error) {
            throw new Error(`Error getting documents: ${error.message}`);
        }
    }



    async getDocumentById(documentId) {
        try {
            const document = await Document.findById(documentId);
            if (!document) {
                throw new Error('Document not found');
            }

         
            
            const bucketName = 'documents';
            // MinioService doesn't expose a direct getFile helper that returns a stream,
            // so use the underlying minio client to getObject stream
            const fileStream = await minioClient.minioClient.getObject(bucketName, document.cheminFichier);
            
            return {
                document,
                fileStream
            };
        } catch (error) {
            throw new Error(`Error getting document: ${error.message}`);
        }
    }

    

    async updateDocument(documentId, typeDocument) {
        try {
            const document = await Document.findByIdAndUpdate(
                documentId,
                { typeDocument },
                { new: true }
            );
            
            if (!document) {
                throw new Error('Document not found');
            }
            
            return document;
        } catch (error) {
            throw new Error(`Error updating document: ${error.message}`);
        }
    }


    async deleteDocument(documentId) {
        try {
            const document = await Document.findById(documentId);
            if (!document) {
                throw new Error('Document not found');
            }

      
            const bucketName = 'documents';
            await minioClient.deleteFile(bucketName, document.cheminFichier);

 
            await Document.findByIdAndDelete(documentId);

            return { message: 'Document deleted successfully' };
        } catch (error) {
            throw new Error(`Error deleting document: ${error.message}`);
        }
    }
}

module.exports = new DocumentService();
