export default class GlobalError extends Error {
  statusCode: number;
  status?: string;
  isOperational: boolean;
  path: string;
  value: string;
  kind: string

  constructor(message: string, statusCode: number, path: string = '', value: string = '', kind: string = '') {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.path = path;
    this.value = value;
    this.kind = kind;

    Error.captureStackTrace(this, this.constructor)
  }
}