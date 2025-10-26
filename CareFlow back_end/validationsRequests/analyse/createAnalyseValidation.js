const Joi = require('joi');

const createAnalyseValidation = (data) => {
    const schema = Joi.object({
        typeAnalyse: Joi.string().required(),
        dateAnalyse: Joi.date().required(),
        resultat: Joi.string().required(),
        dossierMedicalId: Joi.string().required()
    });

    return schema.validate(data);
};

module.exports = createAnalyseValidation;