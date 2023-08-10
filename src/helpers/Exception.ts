
class Exception extends Error {
  code: number;
  reportError: boolean;

  constructor(message: string, code: number = 500, reportError = false) {

    super(message);
    this.code = code;
    this.reportError = reportError;

  }

}

export default Exception;
