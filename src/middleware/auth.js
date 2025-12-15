const { verifyToken } = require('../config/cognito');
const ResponseHelper = require('../utils/responseHelper');
const MESSAGES = require('../constants/messages');

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return ResponseHelper.unauthorized(res, MESSAGES.AUTH.TOKEN_MISSING);
    }

    const decoded = await verifyToken(token);

    req.user = {
      sub: decoded.sub,
      email: decoded.email,
      username: decoded['cognito:username'] || decoded.username
    };

    next();
  } catch (error) {
    console.error('Error en autenticación:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return ResponseHelper.unauthorized(res, MESSAGES.AUTH.TOKEN_EXPIRED);
    }
    
    if (error.name === 'JsonWebTokenError') {
      return ResponseHelper.unauthorized(res, MESSAGES.AUTH.TOKEN_INVALID);
    }

    return ResponseHelper.unauthorized(res, 'Error al verificar el token de autenticación');
  }
}

module.exports = {
  authenticateToken
};
