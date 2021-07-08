class HttpError extends Error {
  constructor(messag, errorCode) {
    super(messag); //ads the messaqge property
    this.code = errorCode; //adds the error code property
  }
}

module.exports = HttpError;
