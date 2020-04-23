class TokenExpiredError extends Error {
  constructor(message = '') {
    super();
    this.name = 'TokenExpiredError';
    this.status = '401';
    this.message = `Token Expired! ${message}`.trim();
  }
}
class TokenInvalidError extends Error {
  constructor(message = '') {
    super();
    this.name = 'TokenInvalidError';
    this.status = '401';
    this.message = `Invalid Token! ${message}`.trim();
  }
}
class InvalidCredentialsError extends Error {
  constructor(message = '') {
    super();
    this.name = 'InvalidCredentialsError';
    this.status = '400';
    this.message = `Invalid Credentials ${message}`.trim();
  }
}

class InvalidSessionError extends Error {
  constructor(message = '') {
    super();
    this.name = 'InvalidSessionError';
    this.status = '401';
    this.message = `Invalid Session ${message}`.trim();
  }
}

module.exports = {
  TokenExpiredError,
  TokenInvalidError,
  InvalidCredentialsError,
  InvalidSessionError,
};
