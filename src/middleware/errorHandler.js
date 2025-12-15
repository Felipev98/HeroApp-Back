const ResponseHelper = require('../utils/responseHelper');
const MESSAGES = require('../constants/messages');


function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.isOperational) {
    return ResponseHelper.error(
      res,
      err.message,
      err.statusCode,
      err.code
    );
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    return ResponseHelper.validationError(
      res,
      MESSAGES.ERROR.BAD_REQUEST,
      errors
    );
  }

  if (err.name === 'CastError') {
    return ResponseHelper.error(
      res,
      'ID inválido',
      400,
      'INVALID_ID'
    );
  }

  if (err.status === 404 || err.statusCode === 404) {
    return ResponseHelper.notFound(res, err.message || MESSAGES.ERROR.NOT_FOUND);
  }

  console.error('Error no manejado:', err);
  return ResponseHelper.error(
    res,
    MESSAGES.ERROR.INTERNAL_SERVER,
    500,
    'INTERNAL_SERVER_ERROR'
  );
}

module.exports = {
  errorHandler
};
