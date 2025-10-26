const Joi = require('joi');

const createVaccinationValidation = (data) => {
    const schema = Joi.object({
        nomVaccin: Joi.string().required(),
        dateVaccination: Joi.date().required(),
        rappel: Joi.date(),
        dossierMedicalId: Joi.string().required()
    });

    return schema.validate(data);
};

module.exports = createVaccinationValidation;