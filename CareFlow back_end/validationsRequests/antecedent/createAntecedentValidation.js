const Joi = require('joi');

const createAntecedentValidation = (data) => {
    const schema = Joi.object({
        type: Joi.string().required(),
        description: Joi.string().required(),
        dossierMedicalId: Joi.string().required()
    });

    return schema.validate(data);
};

module.exports = createAntecedentValidation;