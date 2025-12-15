const STATUS_CODES = require('../constants/statusCodes');

class ResponseHelper {

  static success(res, data = null, message = null, statusCode = STATUS_CODES.OK) {
    const response = {
      success: true
    };

    if (message) {
      response.message = message;
    }

    if (data !== null) {
      if (Array.isArray(data)) {
        response.count = data.length;
        response.data = data;
      } else if (typeof data === 'object' && data !== null) {
        response.data = data;
      } else {
        response.data = data;
      }
    }

    return res.status(statusCode).json(response);
  }


  static error(res, message, statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR, code = null, errors = null) {
    const response = {
      success: false
    };

    if (code) {
      response.error = code;
    }

    if (message) {
      response.message = message;
    }

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  static created(res, data, message = null) {
    return this.success(res, data, message, STATUS_CODES.CREATED);
  }

  static validationError(res, message, errors = []) {
    return this.error(res, message, STATUS_CODES.BAD_REQUEST, 'VALIDATION_ERROR', errors);
  }

  static unauthorized(res, message = 'No autorizado') {
    return this.error(res, message, STATUS_CODES.UNAUTHORIZED, 'UNAUTHORIZED');
  }

  static notFound(res, message = 'Recurso no encontrado') {
    return this.error(res, message, STATUS_CODES.NOT_FOUND, 'NOT_FOUND');
  }

  static conflict(res, message = 'Conflicto') {
    return this.error(res, message, STATUS_CODES.CONFLICT, 'CONFLICT');
  }
}

module.exports = ResponseHelper;

