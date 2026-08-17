# EnumSet

[![NPM Version](https://img.shields.io/npm/v/%40marco.spiess%2Fenumset)](https://www.npmjs.com/package/@marco.spiess/enumset)
![NPM License](https://img.shields.io/npm/l/%40marco.spiess%2Fenumset)
[![Coverage Status](https://coveralls.io/repos/github/mspiess/enumset/badge.svg?branch=main)](https://coveralls.io/github/mspiess/enumset?branch=main)

A specialized [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) implementation
for use with numerical enum types.
All state is packed into a single 32-bit integer bitfield.

## Installation

```shell
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

## Benchmark

Compared to the native `Set` `EnumSets` perform better for `add` and `delete`.
For `has` and iteration `EnumSets` are slightly slower.
For all set composition methods `EnumSets` vastly outperform their native counterparts.

<details>
<summary>Result of a benchmark run in CI</summary>

```
 ✓  bench  src/main.benchmark.ts (14 tests) 209391ms
   ✓ has (2)
     ✓ empty set 19811ms
       name                   hz     min     max    mean     p75     p99    p995    p999     rme   samples
       native set  21,206,116.26  0.0000  0.1372  0.0000  0.0001  0.0001  0.0001  0.0001  ±0.09%  20636388   fastest
       enum set    13,198,874.44  0.0001  0.0909  0.0001  0.0001  0.0001  0.0001  0.0001  ±0.08%  12924792
     ✓ full set 20078ms
       name                   hz     min     max    mean     p75     p99    p995    p999     rme   samples
       native set  21,291,907.56  0.0000  0.0978  0.0000  0.0001  0.0001  0.0001  0.0001  ±0.10%  20736684   fastest
       enum set    13,237,134.16  0.0001  0.0427  0.0001  0.0001  0.0001  0.0001  0.0001  ±0.07%  13005323
   ✓ add 11337ms
     name                   hz     min     max    mean     p75     p99    p995    p999     rme   samples
     enum set    14,437,209.78  0.0001  0.0320  0.0001  0.0001  0.0001  0.0001  0.0001  ±0.07%  14219315   fastest
     native set   4,048,108.96  0.0002  0.3157  0.0003  0.0003  0.0003  0.0003  0.0007  ±0.25%   3965984
   ✓ delete 11266ms
     name                   hz     min     max    mean     p75     p99    p995    p999     rme   samples
     enum set    14,224,467.32  0.0001  0.0729  0.0001  0.0001  0.0001  0.0001  0.0001  ±0.08%  14015339   fastest
     native set   4,287,069.25  0.0002  0.3568  0.0002  0.0002  0.0003  0.0004  0.0007  ±0.30%   4186946
   ✓ keys 22782ms
     name                   hz     min     max    mean     p75     p99    p995    p999     rme   samples
     native set  22,845,624.54  0.0000  0.0415  0.0000  0.0001  0.0001  0.0001  0.0001  ±0.07%  22276472   fastest
     enum set    22,849,172.68  0.0000  0.0951  0.0000  0.0001  0.0001  0.0001  0.0001  ±0.08%  22254698
   ✓ values 17108ms
     name                   hz     min      max    mean     p75     p99    p995    p999     rme   samples
     native set  19,279,170.57  0.0000   0.0413  0.0001  0.0001  0.0001  0.0001  0.0001  ±0.08%  18898286   fastest
     enum set    12,656,450.07  0.0001  18.8421  0.0001  0.0001  0.0001  0.0001  0.0005  ±4.09%  11694214
   ✓ Symbol(Symbol.iterator) 19436ms
     name                   hz     min      max    mean     p75     p99    p995    p999      rme   samples
     native set  19,442,343.10  0.0000   0.0798  0.0001  0.0001  0.0001  0.0001  0.0001   ±0.08%  19006739   fastest
     enum set    17,544,892.40  0.0000  66.8953  0.0001  0.0001  0.0001  0.0001  0.0004  ±13.17%  15254944
   ✓ union 12892ms
     name                   hz     min     max    mean     p75     p99    p995    p999     rme   samples
     enum set    20,008,001.47  0.0000  0.1361  0.0001  0.0001  0.0001  0.0001  0.0001  ±0.08%  19682920   fastest
     native set   2,583,085.76  0.0003  0.3434  0.0004  0.0004  0.0006  0.0007  0.0011  ±0.48%   2473422
   ✓ intersection 10870ms
     name                   hz     min     max    mean     p75     p99    p995    p999     rme   samples
     enum set    14,711,000.12  0.0001  0.0299  0.0001  0.0001  0.0001  0.0001  0.0001  ±0.08%  14419920   fastest
     native set   2,186,253.34  0.0004  0.4180  0.0005  0.0005  0.0006  0.0008  0.0011  ±0.37%   2127560
   ✓ difference 11318ms
     name                   hz     min     max    mean     p75     p99    p995    p999     rme   samples
     enum set    13,911,659.27  0.0001  0.0480  0.0001  0.0001  0.0001  0.0001  0.0001  ±0.08%  13645951   fastest
     native set   3,541,035.40  0.0002  0.0290  0.0003  0.0003  0.0004  0.0005  0.0009  ±0.08%   3463004
   ✓ symmetricDifference 11600ms
     name                   hz     min     max    mean     p75     p99    p995    p999     rme   samples
     enum set    13,746,639.49  0.0001  0.0841  0.0001  0.0001  0.0001  0.0001  0.0001  ±0.11%  13438668   fastest
     native set   5,153,365.76  0.0002  0.3619  0.0002  0.0002  0.0002  0.0003  0.0006  ±0.40%   4995671
   ✓ isSubsetOf 15365ms
     name                   hz     min     max    mean     p75     p99    p995    p999     rme   samples
     enum set    21,584,121.56  0.0000  0.1773  0.0000  0.0001  0.0001  0.0001  0.0001  ±0.12%  20949499   fastest
     native set   5,478,922.03  0.0002  0.0427  0.0002  0.0002  0.0002  0.0002  0.0004  ±0.07%   5405264
   ✓ isSupersetOf 12293ms
     name                   hz     min     max    mean     p75     p99    p995    p999     rme   samples
     enum set    15,724,180.49  0.0000  0.0490  0.0001  0.0001  0.0001  0.0001  0.0001  ±0.07%  15426052   fastest
     native set   4,863,504.30  0.0002  0.0346  0.0002  0.0002  0.0004  0.0004  0.0005  ±0.08%   4700775
   ✓ isDisjointFrom 13232ms
     name                   hz     min     max    mean     p75     p99    p995    p999     rme   samples
     enum set    16,888,742.09  0.0000  0.0478  0.0001  0.0001  0.0001  0.0001  0.0001  ±0.08%  16538521   fastest
     native set   4,836,225.74  0.0002  0.0411  0.0002  0.0002  0.0002  0.0003  0.0004  ±0.07%   4765987
```

</details>

To run the benchmark:
```shell
npm run benchmark
```