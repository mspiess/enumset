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

test('should not admit negative numbers', () => {
  // @ts-expect-error negative number
  assertType(new EnumSet([-1]));
});

test('should not admit number type', () => {
  // @ts-expect-error number does not satisfy constraints
  assertType(new EnumSet<number>());
});

test('should be assignable to Set', () => {
  expectTypeOf(new EnumSet([0])).toExtend<Set<0>>();
});

test('should return a Set of type union', () => {
  expectTypeOf(new EnumSet([0]).union(new Set(['someValue']))).toEqualTypeOf<Set<0 | string>>();
});
