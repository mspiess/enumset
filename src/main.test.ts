import { expect, test, vi } from 'vitest';
import { EnumSet } from './main.ts';

const Directions = {
  Left: 0,
  Up: 1,
  Right: 2,
  Down: 3,
} as const;

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

test('should not have element after deletion', () => {
  const enumSet = new EnumSet([Directions.Left, Directions.Right]);

  enumSet.delete(Directions.Left);

  expect(enumSet.has(Directions.Left)).toBe(false);
  expect(enumSet.has(Directions.Right)).toBe(true);
});

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
