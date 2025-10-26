const Joi = require('joi');

const updateAnalyseValidation = (data) => {
    const schema = Joi.object({
        typeAnalyse: Joi.string(),
        dateAnalyse: Joi.date(),
        resultat: Joi.string()
    });

    return schema.validate(data);
};

module.exports = updateAnalyseValidation;