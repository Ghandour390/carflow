const Document = require('../models/Document');



class DocumentController{
    async getDocuments(req,res){
        try{
            const documents = await Document.find();
            return res.status(200).json({data:documents,msg:"successfully"});
        }catch(e){
            console.log("error",e);
            return res.status(500).json({msg:"error server"});
        }
    }


}

module.exports = new DocumentController();