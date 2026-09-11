import { describe, expect, test } from 'vitest';
import type { IntegerLessThan32 } from './IntegerLessThan32.ts';
import { EnumSet } from './main.ts';

const allValues = [...Array(32).keys()] as IntegerLessThan32[];

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
