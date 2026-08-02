import type { IntegerLessThan32 } from './IntegerLessThan32.ts';

export class EnumSet<T extends IntegerLessThan32> implements Set<T> {
  get [Symbol.toStringTag]() {
    return 'EnumSet';
  };

  set [Symbol.toStringTag](_value) {
  }

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

  has(value: T): boolean;
  has<U>(value: U): value is T & U;
  has(value: T): boolean {
    if (typeof value !== 'number') {
      return false;
    }
    if (value > 31) {
      return false;
    }
    if (value < 0) {
      return false;
    }
    return this.#hasBit(this.#toBit(value));
  }

  add(value: T): this {
    this.#bitfield |= this.#toBit(value);
    return this;
  }

  clear(): void {
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

  keys(): SetIterator<T> {
    return this.values();
  }

  * values(): SetIterator<T> {
    let n = this.#bitfield >>> 0;
    while (n) {
      const leastSignificantBitFlipped = n - 1;
      const next = n & leastSignificantBitFlipped;
      const value = Math.log2((n ^ next) >>> 0) as T;
      yield value;
      n = next;
    }
  };

  * entries(): SetIterator<[T, T]> {
    for (const value of this) {
      yield [value, value];
    }
  }

  [Symbol.iterator](): SetIterator<T> {
    return this.values();
  }

  #toBit(value: T) {
    return 1 << value;
  }

  #hasBit(bit: number) {
    return Boolean(this.#bitfield & bit);
  }

  union(other: EnumSet<T>): EnumSet<T>;
  union<U>(other: ReadonlySetLike<U>): Set<T | U>;
  union<U>(other: ReadonlySetLike<U>): Set<T | U> {
    if (other instanceof EnumSet) {
      const result = new EnumSet<T>();
      result.#bitfield = this.#bitfield | other.#bitfield;
      return result;
    }
    return new Set<T | U>([...this.keys(), ...{ [Symbol.iterator]: () => other.keys() }]);
  }

  intersection<U extends IntegerLessThan32>(other: EnumSet<U>): EnumSet<T & U>;
  intersection<U>(other: ReadonlySetLike<U>): Set<T & U>;
  intersection<U>(other: ReadonlySetLike<U>): Set<T & U> {
    if (other instanceof EnumSet) {
      const result = new EnumSet<T & U>();
      result.#bitfield = this.#bitfield & other.#bitfield;
      return result;
    }
    const intersection: (T & U)[] = [];
    for (const key of [...{ [Symbol.iterator]: () => other.keys() }]) {
      if (this.has(key)) {
        intersection.push(key);
      }
    }
    return new Set<T & U>(intersection);
  }

  difference<U extends IntegerLessThan32>(other: EnumSet<U>): EnumSet<T>;
  difference<U>(other: ReadonlySetLike<U>): Set<T>;
  difference<U>(other: ReadonlySetLike<U>): Set<T> {
    if (other instanceof EnumSet) {
      const result = new EnumSet<T>();
      result.#bitfield = this.#bitfield & (~other.#bitfield);
      return result;
    }
    return new Set<T>([...this].filter(value => !other.has(value as unknown as U)));
  }

  symmetricDifference(other: EnumSet<T>): EnumSet<T>;
  symmetricDifference<U>(other: ReadonlySetLike<U>): Set<T | U>;
  symmetricDifference<U>(other: ReadonlySetLike<U>): Set<T | U> {
    if (other instanceof EnumSet) {
      const result = new EnumSet<T>();
      result.#bitfield = this.#bitfield ^ other.#bitfield;
      return result;
    }
    const union = this.union(other);
    const intersection = this.intersection(other);
    // return union.difference(intersection);
    return new Set([...union].filter(value => !intersection.has(value as T & U)));
  }

  isSubsetOf(other: ReadonlySetLike<unknown>): boolean {
    if (other instanceof EnumSet) {
      return this.#bitfield === (this.#bitfield & other.#bitfield);
    }
    for (const value of this) {
      if (!other.has(value)) {
        return false;
      }
    }
    return true;
  }

  isSupersetOf(other: ReadonlySetLike<unknown>): boolean {
    if (other instanceof EnumSet) {
      return other.isSubsetOf(this);
    }
    return [...{ [Symbol.iterator]: () => other.keys() }].every(value => this.has(value));
  }

  isDisjointFrom(other: ReadonlySetLike<unknown>): boolean {
    if (other instanceof EnumSet) {
      return (this.#bitfield & other.#bitfield) === 0;
    }
    for (const value of this) {
      if (other.has(value)) {
        return false;
      }
    }
    return true;
  }
}

/**
 * @callback ForEachCallback
 * @template T
 * @template This
 * @param {T} value Value of each iteration.
 * @param {T} key Key of each iteration. This is always the same as {@link value}.
 * @param {EnumSet<T>} set The set being iterated.
 * @this {This}
 */
type ForEachCallback<T extends IntegerLessThan32, This> = (this: This, value: T, key: T, set: EnumSet<T>) => void;
