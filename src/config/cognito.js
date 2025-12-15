const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const crypto = require('crypto');

const COGNITO_REGION = process.env.AWS_COGNITO_REGION || 'us-east-1';
const COGNITO_USER_POOL_ID = process.env.AWS_COGNITO_USER_POOL_ID;
const COGNITO_CLIENT_ID = process.env.AWS_COGNITO_CLIENT_ID;
const COGNITO_CLIENT_SECRET = process.env.AWS_COGNITO_CLIENT_SECRET;

function calculateSecretHash(username) {
  if (!COGNITO_CLIENT_SECRET) {
    return null;
  }
  const message = username + COGNITO_CLIENT_ID;
  return crypto
    .createHmac('SHA256', COGNITO_CLIENT_SECRET)
    .update(message)
    .digest('base64');
}

const JWKS_URI = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}/.well-known/jwks.json`;

const client = jwksClient({
  jwksUri: JWKS_URI,
  cache: true,
  cacheMaxAge: 86400000,
  rateLimit: true,
  jwksRequestsPerMinute: 10
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        algorithms: ['RS256'],
        issuer: `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`
      },
      (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded);
      }
    );
  });
}

module.exports = {
  verifyToken,
  calculateSecretHash,
  COGNITO_REGION,
  COGNITO_USER_POOL_ID,
  COGNITO_CLIENT_ID,
  COGNITO_CLIENT_SECRET
};

