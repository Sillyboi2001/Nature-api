export default class GlobalError extends Error {
  statusCode: number;
  status?: string;
  isOperational: boolean;
  path: string;
  value: string;
  kind: string;
  code: number;
  keyValue: any;
  errors: object;
  _message: string;

  constructor(
    message: string,
    statusCode: number,
    errors: object = [],
    path: string = '',
    value: string = '',
    kind: string = '',
    code: number = 0,
    _message: string = ''
  ) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.path = path;
    this.value = value;
    this.kind = kind;
    this.code = code;
    this.keyValue = this.keyValue;
    this.errors = errors;
    this._message = message;

    Error.captureStackTrace(this, this.constructor);
  }
}
