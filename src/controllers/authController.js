const AuthService = require('../services/authService');
const ResponseHelper = require('../utils/responseHelper');
const MESSAGES = require('../constants/messages');
const { handleValidationErrors } = require('../utils/validationHelper');

exports.register = [
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { username, email, password, phone } = req.body;

      if (!username || !email || !password) {
        return ResponseHelper.error(
          res,
          MESSAGES.VALIDATION.REQUIRED_FIELDS + ' (username, email, password)',
          400
        );
      }

      if (password.length < 6) {
        return ResponseHelper.error(
          res,
          MESSAGES.AUTH.PASSWORD_TOO_SHORT,
          400
        );
      }

      const result = await AuthService.register(username, email, password, phone);

      if (result.authResult.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
        return ResponseHelper.success(
          res,
          {
            challenge: 'NEW_PASSWORD_REQUIRED',
            session: result.authResult.Session,
            user: result.user
          },
          'Usuario creado exitosamente. Se requiere establecer una nueva contraseña.'
        );
      }

      return res.status(201).json({
        success: true,
        message: MESSAGES.AUTH.REGISTER_SUCCESS,
        token: result.authResult.AuthenticationResult.IdToken,
        accessToken: result.authResult.AuthenticationResult.AccessToken,
        user: result.user
      });
    } catch (error) {
      if (error.code === 'UsernameExistsException') {
        return ResponseHelper.conflict(res, 'El nombre de usuario ya existe');
      }

      if (error.code === 'InvalidParameterException' || error.code === 'InvalidPasswordException') {
        const errorMessage = error.message || MESSAGES.AUTH.PASSWORD_POLICY_VIOLATION;
        return ResponseHelper.error(res, errorMessage, 400);
      }

      if (error.isOperational) {
        return ResponseHelper.error(res, error.message, error.statusCode, error.code);
      }

      next(error);
    }
  }
];

exports.login = [
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return ResponseHelper.error(
          res,
          MESSAGES.VALIDATION.REQUIRED_FIELDS + ' (email, password)',
          400
        );
      }

      const result = await AuthService.login(email, password);

      if (result.challenge === 'NEW_PASSWORD_REQUIRED') {
        return ResponseHelper.success(
          res,
          {
            challenge: 'NEW_PASSWORD_REQUIRED',
            session: result.session
          },
          MESSAGES.AUTH.NEW_PASSWORD_REQUIRED
        );
      }

      return res.status(200).json({
        success: true,
        message: MESSAGES.AUTH.LOGIN_SUCCESS,
        token: result.tokens.idToken,
        accessToken: result.tokens.accessToken,
        user: result.user
      });
    } catch (error) {
      if (error.code === 'UserNotConfirmedException') {
        return ResponseHelper.error(
          res,
          MESSAGES.AUTH.USER_NOT_CONFIRMED,
          400
        );
      }

      if (error.isOperational) {
        return ResponseHelper.error(res, error.message, error.statusCode, error.code);
      }

      next(error);
    }
  }
];
