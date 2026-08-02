# EnumSet

[![Coverage Status](https://coveralls.io/repos/github/mspiess/enumset/badge.svg?branch=main)](https://coveralls.io/github/mspiess/enumset?branch=main)

A specialized [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) implementation
for use with numerical enum types.
All state is packed into a single 32-bit integer bitfield.

## Installation

```
npm install @marco.spiess/enumset
```

## Usage

```ts
import { EnumSet } from "@marco.spiess/enumset";
```

```ts @import.meta.vitest
// Declare an enum
const Directions = {
  Left: 0,
  Up: 1,
  Right: 2,
  Down: 3,
} as const;
type Direction = typeof Directions[keyof typeof Directions];

const enumSet = new EnumSet<Direction>([Directions.Up]);
enumSet.add(Directions.Down);

expect([...enumSet.values()]).toStrictEqual([Directions.Up, Directions.Down]);
expect(enumSet.has(Directions.Left)).toBe(false);
```

## Caveats

- All enum values must be integers in the interval [0,32). This is enforced through TypeScript.
- Iteration order breaks the [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
    contract. The methods `forEach`, `keys`, `values` and `[Symbol.iterator]` iterate in the ascending order of the enum
    values and *not* in insertion order.
