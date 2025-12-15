const { validationResult } = require('express-validator');
const ResponseHelper = require('./responseHelper');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Transformar los errores de express-validator al formato esperado por el frontend
    const formattedErrors = errors.array().map(error => ({
      field: error.param || error.path || 'unknown',
      message: error.msg || error.message || 'Error de validación'
    }));
    
    return ResponseHelper.validationError(
      res,
      'Error de validación',
      formattedErrors
    );
  }
  
  next();
};


const validateRequired = (field, fieldName) => {
  if (!field || (typeof field === 'string' && !field.trim())) {
    throw new Error(`${fieldName} es requerido`);
  }
};

const validateMinLength = (field, minLength, fieldName) => {
  if (field && field.length < minLength) {
    throw new Error(`${fieldName} debe tener al menos ${minLength} caracteres`);
  }
};

const validateMaxLength = (field, maxLength, fieldName) => {
  if (field && field.length > maxLength) {
    throw new Error(`${fieldName} no puede exceder ${maxLength} caracteres`);
  }
};

module.exports = {
  handleValidationErrors,
  validateRequired,
  validateMinLength,
  validateMaxLength
};

