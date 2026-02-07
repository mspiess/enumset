import { test, assertType, expectTypeOf } from 'vitest';
import { EnumSet } from './main';
import type { IntegerLessThan32 } from './IntegerLessThan32';

test('should not admit numbers > 31', () => {
  // @ts-expect-error number is > 31
  assertType(new EnumSet([32]));
});

test('should admit numbers <= 31', () => {
  const number = 1 as IntegerLessThan32;

  expectTypeOf(new EnumSet([number])).toEqualTypeOf<EnumSet<typeof number>>();
});

test('should not admit numbers outside the type parameter', () => {
  // @ts-expect-error number is not part of type parameter
  assertType(new EnumSet<0 | 1>([2]));
  // @ts-expect-error number is not part of type parameter
  assertType(new EnumSet<3 | 4>([2]));
});
