const Joi = require('joi');

const vaccinationIdValidation = (data) => {
    const schema = Joi.object({
        id: Joi.string().required()
    });

    return schema.validate(data);
};

module.exports = vaccinationIdValidation;