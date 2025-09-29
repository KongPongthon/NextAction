export class ServiceError extends Error {
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;

    // จำเป็นถ้าใช้ TypeScript + Babel
    Object.setPrototypeOf(this, ServiceError.prototype);
  }
}
