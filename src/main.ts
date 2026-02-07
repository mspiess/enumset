import type { IntegerLessThan32 } from './IntegerLessThan32.ts';

export class EnumSet<T extends IntegerLessThan32> {
  #bitfield: number = 0;

  constructor(iterable?: Iterable<T>) {
    if (iterable) {
      for (const value of iterable) {
        this.#bitfield |= (1 << value);
      }
    }
  }

  get size(): number {
    let size = 0;
    // Ensure unsigned 32-bit integer
    let n = this.#bitfield >>> 0;
    while (n) {
      // Clear least significant bit
      n &= n - 1;
      size++;
    }
    return size;
  }

  has(value: T): boolean {
    return Boolean(this.#bitfield & (1 << value));
  }

  add(value: T): this {
    this.#bitfield |= (1 << value);
    return this;
  }

  clear() {
    this.#bitfield = 0;
  }

  delete(value: T) {
    this.#bitfield ^= (1 << value);
  }
}
