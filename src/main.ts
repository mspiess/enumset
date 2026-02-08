import type { IntegerLessThan32 } from './IntegerLessThan32.ts';

export class EnumSet<T extends IntegerLessThan32> {
  #bitfield: number = 0;

  constructor(iterable?: Iterable<T>) {
    if (iterable) {
      for (const value of iterable) {
        this.#bitfield |= this.#toBit(value);
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
    return this.#hasBit(this.#toBit(value));
  }

  add(value: T): this {
    this.#bitfield |= this.#toBit(value);
    return this;
  }

  clear() {
    this.#bitfield = 0;
  }

  delete(value: T): boolean {
    const bit = this.#toBit(value);
    const had = this.#hasBit(bit);
    this.#bitfield ^= bit;
    return had;
  }

  /**
   * Executes {@link callback} once for each value in this set, in the numeric order of the enum {@link T}.
   *
   * @template T
   * @param {ForEachCallback<T, undefined>} callback A function to execute for each entry in the set.
   */
  forEach(callback: ForEachCallback<T, undefined>): void;

  /**
   * Executes {@link callback} once for each value in this set, in the numeric order of the enum {@link T}.
   *
   * @template T
   * @template This
   * @param {ForEachCallback<T, This>} callback A function to execute for each entry in the set.
   * @param {This} thisArg A value to use as `this` when executing {@link callback}.
   */
  forEach<This>(callback: ForEachCallback<T, This>, thisArg: This): void;

  forEach<This = undefined>(callback: (this: This | undefined, value: T, key: T, set: EnumSet<T>) => void, thisArg?: This) {
    for (const value of this) {
      callback.call(thisArg, value, value, this);
    }
  }

  * values(): Iterator<T, void, unknown> {
    let n = this.#bitfield >>> 0;
    while (n) {
      const leastSignificantBitFlipped = n - 1;
      const next = n & leastSignificantBitFlipped;
      const value = Math.log2(n ^ next) as T;
      yield value;
      n = next;
    }
  };

  [Symbol.iterator](): Iterator<T, void, unknown> {
    return this.values();
  }

  #toBit(value: T) {
    return 1 << value;
  }

  #hasBit(bit: number) {
    return Boolean(this.#bitfield & bit);
  }
}

/**
 * @callback ForEachCallback
 * @template T
 * @template This
 * @param {T} value Value of each iteration.
 * @param {T} key Key of each iteration. This is always the same as {@link value}.
 * @param {EnumSet<T>} The set being iterated.
 * @this {This}
 */
type ForEachCallback<T extends IntegerLessThan32, This> = (this: This, value: T, key: T, set: EnumSet<T>) => void;
