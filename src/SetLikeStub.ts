/* v8 ignore file -- @preserve */
export class SetLikeStub<T> implements ReadonlySetLike<T> {
  readonly #elements: T[];
  constructor(iterable: Iterable<T>) {
    this.#elements = [...iterable];
  }

  get size(): number {
    return this.#elements.length;
  }

  has(value: T): boolean {
    return this.#elements.includes(value);
  }

  keys(): Iterator<T> {
    return this.#elements[Symbol.iterator]();
  }
}
