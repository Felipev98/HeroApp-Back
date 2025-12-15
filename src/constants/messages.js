
const MESSAGES = {
  AUTH: {
    REGISTER_SUCCESS: 'Usuario registrado exitosamente',
    LOGIN_SUCCESS: 'Inicio de sesión exitoso',
    LOGOUT_SUCCESS: 'Sesión cerrada exitosamente',
    INVALID_CREDENTIALS: 'Credenciales inválidas',
    USER_NOT_FOUND: 'Usuario no encontrado',
    USER_ALREADY_EXISTS: 'El nombre de usuario ya está registrado',
    EMAIL_ALREADY_EXISTS: 'El correo electrónico ya está registrado',
    PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 6 caracteres',
    PASSWORD_POLICY_VIOLATION: 'La contraseña no cumple con las políticas requeridas',
    TOKEN_EXPIRED: 'Token expirado',
    TOKEN_INVALID: 'Token inválido',
    TOKEN_MISSING: 'Token de autenticación no proporcionado',
    USER_NOT_CONFIRMED: 'Usuario no confirmado. Por favor, verifica tu email.',
    NEW_PASSWORD_REQUIRED: 'Se requiere establecer una nueva contraseña'
  },

  HEROES: {
    CREATED: 'Heroe creado exitosamente',
    UPDATED: 'Heroe actualizado exitosamente',
    DELETED: 'Heroe eliminado exitosamente',
    MARKED_AS_DONE: 'Heroe marcado como completado',
    ALREADY_DONE: 'El héroe ya está marcado como completado',
    NOT_FOUND: 'Heroe no encontrado',
    INVALID_ID: 'ID de héroe inválido'
  },

  VALIDATION: {
    REQUIRED_FIELDS: 'Todos los campos son requeridos',
    INVALID_EMAIL: 'Email inválido',
    INVALID_LENGTH: 'Longitud inválida',
    NAME_REQUIRED: 'El nombre es requerido',
    NAME_LENGTH: 'El nombre debe tener entre 2 y 100 caracteres',
    DESCRIPTION_LENGTH: 'La descripción no puede exceder 60000 caracteres',
    POWER_LENGTH: 'El poder no puede exceder 100 caracteres'
  },

  // Errores generales
  ERROR: {
    INTERNAL_SERVER: 'Ha ocurrido un error en el servidor',
    UNAUTHORIZED: 'No autorizado',
    NOT_FOUND: 'Recurso no encontrado',
    BAD_REQUEST: 'Solicitud inválida'
  }
};

module.exports = MESSAGES;

