export class AlreadyExistsError extends Error {
  public constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, AlreadyExistsError.prototype);
  }
}

export class EntityNotFoundError extends Error {
  public constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, EntityNotFoundError.prototype);
  }
}
