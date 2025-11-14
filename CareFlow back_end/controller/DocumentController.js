const DocumentService = require('../services/DocumentService');



class DocumentController{

    async getDocuments(req, res) {
        try {
            const userId = req.user.id;
            const documents = await DocumentService.getDocuments(userId);
            res.status(200).json(documents);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async uploadDocument(req, res) {
        try {
            const file = req.file;
            const { typeDocument, dossierMedicalId } = req.body;  
            const createurId = req.user.id;
            const document = await DocumentService.uploadDocument(file, typeDocument, dossierMedicalId, createurId);
            res.status(201).json(document);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getDocumentsByDossier(req, res) {
        try {
            const { dossierMedicalId } = req.params;
            const documents = await DocumentService.getDocumentsByDossier(dossierMedicalId);
            res.status(200).json(documents);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getDocumentById(req, res) {
        try {
            const { documentId } = req.params;
            const { document, fileStream } = await DocumentService.getDocumentById(documentId);
            res.setHeader('Content-Type', document.typeDocument);
            fileStream.pipe(res);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


}

module.exports = new DocumentController();