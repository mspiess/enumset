# EnumSet

[![NPM Version](https://img.shields.io/npm/v/%40marco.spiess%2Fenumset)](https://www.npmjs.com/package/@marco.spiess/enumset)
![NPM License](https://img.shields.io/npm/l/%40marco.spiess%2Fenumset)
[![Coverage Status](https://coveralls.io/repos/github/mspiess/enumset/badge.svg?branch=main)](https://coveralls.io/github/mspiess/enumset?branch=main)
[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fmspiess%2Fenumset%2Fmain)](https://dashboard.stryker-mutator.io/reports/github.com/mspiess/enumset/main)

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
