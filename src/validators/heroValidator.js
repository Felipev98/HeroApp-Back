const { body } = require('express-validator');
const MESSAGES = require('../constants/messages');

const heroValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage(MESSAGES.VALIDATION.NAME_REQUIRED)
    .isLength({ min: 2, max: 100 })
    .withMessage(MESSAGES.VALIDATION.NAME_LENGTH),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 60000 })
    .withMessage(MESSAGES.VALIDATION.DESCRIPTION_LENGTH),
  body('power')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage(MESSAGES.VALIDATION.POWER_LENGTH)
];

module.exports = {
  heroValidation
};

