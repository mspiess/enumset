import { describe, expect, test, vi } from 'vitest';
import { EnumSet } from './main.ts';
import { SetLikeStub } from './SetLikeStub.ts';

const Directions = {
  Left: 0,
  Up: 1,
  Right: 2,
  Down: 3,
} as const;

type Direction = typeof Directions[keyof typeof Directions];

test('should initialize empty', () => {
  const enumSet = new EnumSet();

  expect(enumSet.size).toEqual(0);
});

test('should take size from initialization array', () => {
  const enumSet = new EnumSet([Directions.Left]);

  expect(enumSet.size).toEqual(1);
});

test('should throw when trying to set size', () => {
  const enumSet = new EnumSet();

  // @ts-expect-error size is readonly
  expect(() => enumSet.size = 1).toThrow();
});

test('should have member from initialization', () => {
  const enumSet = new EnumSet([Directions.Left]);

  expect(enumSet.has(Directions.Left)).toEqual(true);
});

test('should not have element in empty set', () => {
  const enumSet = new EnumSet();

  expect(enumSet.has(Directions.Left)).toEqual(false);
});

test('should have element after adding it', () => {
  const enumSet = new EnumSet();

  enumSet.add(Directions.Left);

  expect(enumSet.has(Directions.Left)).toEqual(true);
});

test('should increase size after adding', () => {
  const enumSet = new EnumSet();

  enumSet.add(Directions.Left);

  expect(enumSet.size).toEqual(1);
});

test('should not have element after clearing', () => {
  const enumSet = new EnumSet([Directions.Left]);

  enumSet.clear();

  expect(enumSet.has(Directions.Left)).toEqual(false);
});

describe('delete', () => {
  test('should not have element after deletion', () => {
    const enumSet = new EnumSet([Directions.Left, Directions.Right]);

    enumSet.delete(Directions.Left);

    expect(enumSet.has(Directions.Left)).toBe(false);
    expect(enumSet.has(Directions.Right)).toBe(true);
  });

  test('should return false if value was not in the set', () => {
    const enumSet = new EnumSet<Direction>([Directions.Left]);

    const deleted = enumSet.delete(Directions.Right);

    expect(deleted).toBe(false);
  });

  test('should return true if value was in the set', () => {
    const enumSet = new EnumSet<Direction>([Directions.Left]);

    const deleted = enumSet.delete(Directions.Left);

    expect(deleted).toBe(true);
  });
});

describe('forEach', () => {
  test('should iterate through elements', () => {
    const callbackFn = vi.fn();
    const enumSet = new EnumSet([Directions.Right, Directions.Left]);

    enumSet.forEach(callbackFn);

    expect(callbackFn).toHaveBeenCalledTimes(2);
    expect(callbackFn).toHaveBeenNthCalledWith(1, Directions.Left, Directions.Left, enumSet);
    expect(callbackFn).toHaveBeenLastCalledWith(Directions.Right, Directions.Right, enumSet);
  });

  test('should call callbackFn with thisArg', () => {
    const enumSet = new EnumSet([Directions.Left]);
    const thisArg = {};
    let actual: unknown = null;

    enumSet.forEach(function () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      actual = this;
    }, thisArg);

    expect(actual).toBe(thisArg);
  });
});

describe.for([
  { method: 'keys' as const },
  { method: 'values' as const },
  // workaround for https://github.com/microsoft/TypeScript/issues/54100
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  { method: Symbol.iterator } as { method: typeof Symbol.iterator },
])('values', ({ method }) => {
  test('should return iterator through elements', () => {
    const enumSet = new EnumSet([Directions.Left, Directions.Right]);

    const iterable = enumSet[method]();

    expect(iterable.next().value).toEqual(Directions.Left);
    expect(iterable.next().value).toEqual(Directions.Right);
    const end = iterable.next();
    expect(end.value).toBeUndefined();
    expect(end.done).toBe(true);
  });
});

describe('entries', () => {
  test('should return iterator similar to a Map object', () => {
    const enumSet = new EnumSet([Directions.Left, Directions.Right]);

    const iterable = enumSet.entries();

    expect(iterable.next().value).toEqual([Directions.Left, Directions.Left]);
    expect(iterable.next().value).toEqual([Directions.Right, Directions.Right]);
    const end = iterable.next();
    expect(end.value).toBeUndefined();
    expect(end.done).toBe(true);
  });
});

describe('Symbol.toStringTag', () => {
  test('should have value "EnumSet"', () => {
    const toStringTag = new EnumSet()[Symbol.toStringTag];

    expect(toStringTag).toEqual('EnumSet');
  });

  test('should not be writable', () => {
    const enumSet = new EnumSet();

    enumSet[Symbol.toStringTag] = 'Bad';

    expect(enumSet[Symbol.toStringTag]).toEqual('EnumSet');
  });

  test('should not be enumerable', () => {
    const enumSet = new EnumSet();

    const prototypeProperties = Object.getOwnPropertyNames(Object.getPrototypeOf(enumSet));

    expect(prototypeProperties).not.toContain(Symbol.toStringTag);
  });

  test('should not be deletable', () => {
    const enumSet = new EnumSet();

    // @ts-expect-error toStringTag is not optional
    delete enumSet[Symbol.toStringTag];

    expect(enumSet[Symbol.toStringTag]).toEqual('EnumSet');
  });
});

describe('union', () => {
  test('should return union with other EnumSet', () => {
    const enumSet = new EnumSet<Direction>([Directions.Left, Directions.Up]);

    const union = enumSet.union(new EnumSet([Directions.Up, Directions.Right]));

    expect([...union]).toEqual([Directions.Left, Directions.Up, Directions.Right]);
  });

  test('should return union with set-like', () => {
    const enumSet = new EnumSet<Direction>([Directions.Left, Directions.Up]);
    const setLike = new SetLikeStub([Directions.Up, 'someValue']);
    const union = enumSet.union(setLike);

    expect([...union]).toEqual([Directions.Left, Directions.Up, 'someValue']);
  });
});

describe('intersection', () => {
  test('should return intersection with other EnumSet', () => {
    const enumSet = new EnumSet<Direction>([Directions.Left, Directions.Up]);

    const intersection = enumSet.intersection(new EnumSet([Directions.Up, Directions.Right]));

    expect([...intersection]).toEqual([Directions.Up]);
  });

  test('should return intersection with set-like', () => {
    const enumSet = new EnumSet<Direction>([Directions.Left, Directions.Up]);
    const setLike = new SetLikeStub([Directions.Up, 'someValue']);

    const intersection = enumSet.intersection(setLike);

    expect([...intersection]).toEqual([Directions.Up]);
  });
});

describe('difference', () => {
  test('should return difference with other EnumSet', () => {
    const enumSet = new EnumSet<Direction>([Directions.Left, Directions.Up]);

    const difference = enumSet.difference(new EnumSet([Directions.Up, Directions.Right]));

    expect([...difference]).toEqual([Directions.Left]);
  });

  test('should return difference with set-like', () => {
    const enumSet = new EnumSet<Direction>([Directions.Left, Directions.Up]);
    const setLike = new SetLikeStub([Directions.Up, 'someValue']);

    const difference = enumSet.difference(setLike);

    expect([...difference]).toEqual([Directions.Left]);
  });
});

describe('symmetricDifference', () => {
  test('should return symmetric difference with other EnumSet', () => {
    const enumSet = new EnumSet<Direction>([Directions.Left, Directions.Up]);

    const symmetricDifference = enumSet.symmetricDifference(new EnumSet([Directions.Up, Directions.Right]));

    expect([...symmetricDifference]).toEqual([Directions.Left, Directions.Right]);
  });

  test('should return symmetric difference with set-like', () => {
    const enumSet = new EnumSet<Direction>([Directions.Left, Directions.Up]);
    const setLike = new SetLikeStub([Directions.Up, 'someValue']);

    const symmetricDifference = enumSet.symmetricDifference(setLike);

    expect([...symmetricDifference]).toEqual([Directions.Left, 'someValue']);
  });
});

describe('isSubsetOf', () => {
  test('should be subset of superset EnumSet', () => {
    const enumSet = new EnumSet<Direction>([Directions.Left, Directions.Up]);

    const isSubset = enumSet.isSubsetOf(new EnumSet<Direction>([Directions.Left, Directions.Up, Directions.Right]));

    expect(isSubset).toBe(true);
  });

  test('should not be subset of non-superset EnumSet', () => {
    const enumSet = new EnumSet<Direction>([Directions.Left, Directions.Up]);

    const isSubset = enumSet.isSubsetOf(new EnumSet([Directions.Left]));

    expect(isSubset).toBe(false);
  });

  test('should be subset of superset set-like', () => {
    const enumSet = new EnumSet<Direction>([Directions.Left]);

    const isSubset = enumSet.isSubsetOf(new SetLikeStub([Directions.Left, 'someValue']));

    expect(isSubset).toBe(true);
  });
});

describe('isSupersetOf', () => {
  test('should be superset of subset EnumSet', () => {
    const enumSet = new EnumSet<Direction>([Directions.Left, Directions.Up]);

    const isSuperset = enumSet.isSupersetOf(new EnumSet([Directions.Left]));

    expect(isSuperset).toBe(true);
  });

  test('should be superset of subset set-like', () => {
    const enumSet = new EnumSet<Direction>([Directions.Left, Directions.Up]);

    const isSuperset = enumSet.isSupersetOf(new SetLikeStub([Directions.Left]));

    expect(isSuperset).toBe(true);
  });
});

describe('isDisjointFrom', () => {
  test('should be disjoint from EnumSet', () => {
    const enumSet = new EnumSet<Direction>([Directions.Left]);

    const isDisjoint = enumSet.isDisjointFrom(new EnumSet([Directions.Right]));

    expect(isDisjoint).toBe(true);
  });

  test('should not be disjoint from EnumSet with shared element', () => {
    const enumSet = new EnumSet<Direction>([Directions.Left, Directions.Up]);

    const isDisjoint = enumSet.isDisjointFrom(new EnumSet([Directions.Up, Directions.Right]));

    expect(isDisjoint).toBe(false);
  });

  test('should be disjoint from set-like', () => {
    const enumSet = new EnumSet<Direction>([Directions.Left]);

    const isDisjoint = enumSet.isDisjointFrom(new SetLikeStub(['someValue']));

    expect(isDisjoint).toBe(true);
  });
});
