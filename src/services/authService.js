const AWS = require('aws-sdk');
const { 
  COGNITO_REGION, 
  COGNITO_USER_POOL_ID, 
  COGNITO_CLIENT_ID, 
  calculateSecretHash 
} = require('../config/cognito');
const { ConflictError, UnauthorizedError } = require('../errors/AppError');

AWS.config.update({
  region: COGNITO_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();


class AuthService {

  static async checkUserExistsByUsername(username) {
    try {
      await cognitoIdentityServiceProvider.adminGetUser({
        UserPoolId: COGNITO_USER_POOL_ID,
        Username: username
      }).promise();
      return true;
    } catch (error) {
      if (error.code === 'UserNotFoundException') {
        return false;
      }
      throw error;
    }
  }

  static async checkEmailExists(email) {
    try {
      const params = {
        UserPoolId: COGNITO_USER_POOL_ID,
        Filter: `email = "${email}"`,
        Limit: 1
      };
      
      const result = await cognitoIdentityServiceProvider.listUsers(params).promise();
      return result.Users && result.Users.length > 0;
    } catch (error) {
      console.error('Error verificando email:', error);
      throw error;
    }
  }

  static async createUser(username, email, password, phone = null) {
    const userAttributes = [
      { Name: 'email', Value: email },
      { Name: 'email_verified', Value: 'true' }
    ];

    if (phone && phone.trim()) {
      userAttributes.push(
        { Name: 'phone_number', Value: phone },
        { Name: 'phone_number_verified', Value: 'true' }
      );
    }

    const params = {
      UserPoolId: COGNITO_USER_POOL_ID,
      Username: username,
      UserAttributes: userAttributes,
      MessageAction: 'SUPPRESS'
    };

    let result;
    try {
      result = await cognitoIdentityServiceProvider.adminCreateUser(params).promise();
      
      await cognitoIdentityServiceProvider.adminSetUserPassword({
        UserPoolId: COGNITO_USER_POOL_ID,
        Username: username,
        Password: password,
        Permanent: true
      }).promise();

      return result;
    } catch (passwordError) {
      if (result) {
        try {
          await cognitoIdentityServiceProvider.adminDeleteUser({
            UserPoolId: COGNITO_USER_POOL_ID,
            Username: username
          }).promise();
        } catch (deleteError) {
          console.error('Error al eliminar usuario después de fallo de contraseña:', deleteError);
        }
      }
      throw passwordError;
    }
  }

  static async authenticateUser(username, password) {
    const authParams = {
      AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
      ClientId: COGNITO_CLIENT_ID,
      UserPoolId: COGNITO_USER_POOL_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      }
    };

    const secretHash = calculateSecretHash(username);
    if (secretHash) {
      authParams.AuthParameters.SECRET_HASH = secretHash;
    }

    try {
      const authResult = await cognitoIdentityServiceProvider.adminInitiateAuth(authParams).promise();
      return authResult;
    } catch (error) {
      if (error.code === 'NotAuthorizedException') {
        throw new UnauthorizedError('Credenciales inválidas');
      }
      if (error.code === 'UserNotFoundException') {
        throw new UnauthorizedError('Usuario no encontrado');
      }
      throw error;
    }
  }

  static async getUserInfo(username) {
    const userParams = {
      UserPoolId: COGNITO_USER_POOL_ID,
      Username: username
    };

    const userResult = await cognitoIdentityServiceProvider.adminGetUser(userParams).promise();
    
    const email = userResult.UserAttributes.find(attr => attr.Name === 'email')?.Value || username;
    
    return {
      id: userResult.Username,
      username: userResult.Username,
      email: email
    };
  }

  static async register(username, email, password, phone = null) {
    const usernameExists = await this.checkUserExistsByUsername(username);
    if (usernameExists) {
      throw new ConflictError('El nombre de usuario ya está registrado');
    }

    const emailExists = await this.checkEmailExists(email);
    if (emailExists) {
      throw new ConflictError('El correo electrónico ya está registrado');
    }

    const result = await this.createUser(username, email, password, phone);

    const authResult = await this.authenticateUser(username, password);

    return {
      user: {
        id: result.User.Username,
        username: username,
        email: email
      },
      authResult: authResult
    };
  }

  static async login(email, password) {
    const authResult = await this.authenticateUser(email, password);

    if (authResult.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
      return {
        challenge: 'NEW_PASSWORD_REQUIRED',
        session: authResult.Session
      };
    }

    const userInfo = await this.getUserInfo(email);

    return {
      user: userInfo,
      tokens: {
        idToken: authResult.AuthenticationResult.IdToken,
        accessToken: authResult.AuthenticationResult.AccessToken
      }
    };
  }
}

module.exports = AuthService;

