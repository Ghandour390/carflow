const Joi = require('joi');

const antecedentIdValidation = (data) => {
    const schema = Joi.object({
        id: Joi.string().required()
    });

    return schema.validate(data);
};

module.exports = antecedentIdValidation;