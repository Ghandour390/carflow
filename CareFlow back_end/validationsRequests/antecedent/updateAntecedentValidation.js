const Joi = require('joi');

const updateAntecedentValidation = (data) => {
    const schema = Joi.object({
        type: Joi.string(),
        description: Joi.string()
    });

    return schema.validate(data);
};

module.exports = updateAntecedentValidation;