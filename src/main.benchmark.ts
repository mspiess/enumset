import { describe, expect, test } from 'vitest';
import type { IntegerLessThan32 } from './IntegerLessThan32.ts';
import { EnumSet } from './main.ts';

const allValues = [...Array(32).keys()] as IntegerLessThan32[];
const lowerHalfValues = [...Array(16).keys()] as IntegerLessThan32[];
const upperHalfValues = [...Array(16).keys()].map(value => value + 16) as IntegerLessThan32[];

describe('has', () => {
  test('empty set', async ({ bench }) => {
    const nativeSet = new Set();
    const enumSet = new EnumSet();

    await bench.compare(
      bench('native set', () => {
        allValues.forEach((value) => {
          nativeSet.has(value);
        });
      }), bench('enum set', () => {
        allValues.forEach((value) => {
          enumSet.has(value);
        });
      }),
    );
  });

  test('full set', async ({ bench }) => {
    const nativeSet = new Set(allValues);
    const enumSet = new EnumSet(allValues);

    await bench.compare(
      bench('native set', () => {
        allValues.forEach((value) => {
          nativeSet.has(value);
        });
      }), bench('enum set', () => {
        allValues.forEach((value) => {
          enumSet.has(value);
        });
      }),
    );
  });
});

test('add', async ({ bench }) => {
  const nativeSet = new Set();
  const enumSet = new EnumSet();

  const result = await bench.compare(
    bench('native set', () => {
      allValues.forEach((value) => {
        nativeSet.add(value);
      });
    }), bench('enum set', () => {
      allValues.forEach((value) => {
        enumSet.add(value);
      });
    }),
  );

  expect([...nativeSet.values()]).toStrictEqual(allValues);
  expect([...enumSet.values()]).toStrictEqual(allValues);
  expect(result.get('enum set')).toBeFasterThan(result.get('native set'));
});

test('delete', async ({ bench }) => {
  const nativeSet = new Set(allValues);
  const enumSet = new EnumSet(allValues);

  const result = await bench.compare(
    bench('native set', () => {
      allValues.forEach((value) => {
        nativeSet.delete(value);
      });
    }), bench('enum set', () => {
      allValues.forEach((value) => {
        enumSet.delete(value);
      });
    }),
  );

  expect(nativeSet.size).toBe(0);
  expect(enumSet.size).toBe(0);
  expect(result.get('enum set')).toBeFasterThan(result.get('native set'));
});

test.for([
  { method: 'keys' as const },
  { method: 'values' as const },
  // workaround for https://github.com/microsoft/TypeScript/issues/54100
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  { method: Symbol.iterator } as { method: typeof Symbol.iterator },
])('$method', async ({ method }, { bench }) => {
  const nativeSet = new Set(allValues);
  const enumSet = new EnumSet(allValues);

  await bench.compare(
    bench('native set', () => {
      nativeSet[method]();
    }), bench('enum set', () => {
      enumSet[method]();
    }),
  );
});

test.for<{
  operation: 'union' | 'intersection' | 'difference' | 'symmetricDifference';
  leftValues: IntegerLessThan32[];
  rightValues: IntegerLessThan32[];
  expectedValues: IntegerLessThan32[];
}>([
  {
    operation: 'union',
    leftValues: lowerHalfValues,
    rightValues: upperHalfValues,
    expectedValues: allValues,
  },
  {
    operation: 'intersection',
    leftValues: lowerHalfValues,
    rightValues: allValues,
    expectedValues: lowerHalfValues,
  },
  {
    operation: 'difference',
    leftValues: allValues,
    rightValues: upperHalfValues,
    expectedValues: lowerHalfValues,
  },
  {
    operation: 'symmetricDifference',
    leftValues: [0, 1, 2, 3],
    rightValues: [2, 3, 4, 5],
    expectedValues: [0, 1, 4, 5],
  },
])('$operation', async ({ operation, leftValues, rightValues, expectedValues }, { bench }) => {
  const nativeSets = [new Set(leftValues), new Set(rightValues)];
  const enumSets = [new EnumSet(leftValues), new EnumSet(rightValues)];
  type CompositionMethod = typeof nativeSets[number][typeof operation];

  let nativeResult: Set<IntegerLessThan32> | undefined;
  let enumSetResult: Set<IntegerLessThan32> | undefined;

  const result = await bench.compare(
    bench('native set', () => {
      const [left, right] = nativeSets;

      nativeResult = left[operation](right);
    }),
    bench('enum set', () => {
      const [left, right] = enumSets;

      enumSetResult = (left[operation] as CompositionMethod)(right) as EnumSet<IntegerLessThan32>;
    }),
  );

  expect([...nativeResult!.values()]).toEqual(expectedValues);
  expect([...enumSetResult!.values()]).toEqual(expectedValues);
  expect(result.get('enum set')).toBeFasterThan(result.get('native set'));
});

test.for<{
  operation: 'isDisjointFrom' | 'isSubsetOf' | 'isSupersetOf';
  leftValues: IntegerLessThan32[];
  rightValues: IntegerLessThan32[];
}>([
  {
    operation: 'isSubsetOf',
    leftValues: lowerHalfValues,
    rightValues: allValues,
  },
  {
    operation: 'isSupersetOf',
    leftValues: allValues,
    rightValues: lowerHalfValues,
  },
  {
    operation: 'isDisjointFrom',
    leftValues: lowerHalfValues,
    rightValues: upperHalfValues,
  },
])('$operation', async ({ operation, leftValues, rightValues }, { bench }) => {
  const nativeSets = [new Set(leftValues), new Set(rightValues)];
  const enumSets = [new EnumSet(leftValues), new EnumSet(rightValues)];

  let nativeResult = false;
  let enumSetResult = false;

  const result = await bench.compare(
    bench('native set', () => {
      const [left, right] = nativeSets;

      nativeResult = left[operation](right);
    }),
    bench('enum set', () => {
      const [left, right] = enumSets;

      enumSetResult = left[operation](right);
    }),
  );

  expect(nativeResult).toBe(true);
  expect(enumSetResult).toBe(true);
  expect(result.get('enum set')).toBeFasterThan(result.get('native set'));
});
