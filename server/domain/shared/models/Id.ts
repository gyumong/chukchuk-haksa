export class Id<T> {
  private constructor(private readonly value: T | null) {}

  static create<T>(): Id<T> {
    return new Id<T>(null);
  }

  static of<T>(value: T): Id<T> {
    return new Id<T>(value);
  }

  getValue(): T | null {
    if (this.value === null) {
      throw new Error('Id is null');
    }
    return this.value;
  }

  hasValue(): boolean {
    return this.value !== null;
  }
}
