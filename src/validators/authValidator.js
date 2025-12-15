const { body } = require('express-validator');
const MESSAGES = require('../constants/messages');

const registerValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('El nombre de usuario es requerido')
    .isLength({ min: 3, max: 50 })
    .withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .withMessage('El email debe ser válido')
    .normalizeEmail(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min: 6 })
    .withMessage(MESSAGES.AUTH.PASSWORD_TOO_SHORT)
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .withMessage('El email debe ser válido')
    .normalizeEmail(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('La contraseña es requerida')
];

module.exports = {
  registerValidation,
  loginValidation
};

