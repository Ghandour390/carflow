const Joi = require('joi');

const updateVaccinationValidation = (data) => {
    const schema = Joi.object({
        nomVaccin: Joi.string(),
        dateVaccination: Joi.date(),
        rappel: Joi.date()
    });

    return schema.validate(data);
};

module.exports = updateVaccinationValidation;