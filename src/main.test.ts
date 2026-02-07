import { expect, test } from 'vitest';
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
