# EnumSet

[![NPM Version](https://img.shields.io/npm/v/%40marco.spiess%2Fenumset)](https://www.npmjs.com/package/@marco.spiess/enumset)
![NPM License](https://img.shields.io/npm/l/%40marco.spiess%2Fenumset)
[![Coverage Status](https://coveralls.io/repos/github/mspiess/enumset/badge.svg?branch=main)](https://coveralls.io/github/mspiess/enumset?branch=main)
[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fmspiess%2Fenumset%2Fmain)](https://dashboard.stryker-mutator.io/reports/github.com/mspiess/enumset/main)

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
For iteration `EnumSets` are slightly slower.
For all set composition methods `EnumSets` vastly outperform their native counterparts.

<details>
<summary>Result of a benchmark run in CI</summary>

```
 ✓  bench  src/main.benchmark.ts (14 tests) 183660ms
   ✓ has (2)
     ✓ empty set 9234ms
       name                  hz     min     max    mean     p75     p99    p995    p999     rme  samples
       enum set    2,212,290.89  0.0004  0.0264  0.0005  0.0005  0.0006  0.0008  0.0013  ±0.61%    43361   fastest
       native set  1,910,317.12  0.0005  0.0251  0.0005  0.0005  0.0007  0.0009  0.0016  ±0.65%    37394
     ✓ full set 8706ms
       name                  hz     min     max    mean     p75     p99    p995    p999     rme  samples
       enum set    2,168,149.90  0.0004  0.2108  0.0005  0.0005  0.0007  0.0009  0.0015  ±2.14%    41988   fastest
       native set  1,814,483.78  0.0005  0.0208  0.0006  0.0006  0.0007  0.0010  0.0014  ±0.53%    35703
   ✓ add 3368ms
     name                hz     min     max    mean     p75     p99    p995    p999     rme  samples
     enum set    765,269.52  0.0013  0.2310  0.0013  0.0013  0.0014  0.0017  0.0106  ±0.08%   756426   fastest
     native set  670,282.98  0.0014  0.0512  0.0015  0.0015  0.0015  0.0018  0.0107  ±0.07%   663137
   ✓ delete 10659ms
     name                hz     min     max    mean     p75     p99    p995    p999     rme  samples
     enum set    744,727.15  0.0013  0.0547  0.0014  0.0013  0.0014  0.0015  0.0122  ±0.08%   735188   fastest
     native set  526,502.96  0.0018  0.3056  0.0019  0.0019  0.0023  0.0032  0.0134  ±0.18%   517633
   ✓ keys 23515ms
     name                   hz     min     max    mean     p75     p99    p995    p999     rme   samples
     native set  20,396,552.13  0.0000  0.0484  0.0001  0.0001  0.0001  0.0001  0.0001  ±0.08%  19746324   fastest
     enum set    18,574,153.26  0.0000  0.3133  0.0001  0.0001  0.0001  0.0001  0.0003  ±0.44%  17471253
   ✓ values 16390ms
     name                   hz     min      max    mean     p75     p99    p995    p999     rme   samples
     native set  15,723,102.08  0.0000   1.0625  0.0001  0.0001  0.0001  0.0001  0.0002  ±0.23%  15285112   fastest
     enum set    10,238,475.10  0.0001  10.8002  0.0001  0.0001  0.0001  0.0002  0.0005  ±2.14%   9750019
   ✓ Symbol(Symbol.iterator) 19054ms
     name                   hz     min     max    mean     p75     p99    p995    p999     rme   samples
     native set  17,267,613.37  0.0000  0.0352  0.0001  0.0001  0.0001  0.0001  0.0001  ±0.08%  16798700   fastest
     enum set    13,645,529.32  0.0001  0.3961  0.0001  0.0001  0.0001  0.0001  0.0004  ±0.39%  13034718
   ✓ union 13889ms
     name                   hz     min     max    mean     p75     p99    p995    p999      rme   samples
     enum set    19,909,270.20  0.0000  0.2769  0.0001  0.0001  0.0001  0.0001  0.0001   ±0.10%  19437808   fastest
     native set   2,512,041.58  0.0004  143.38  0.0005  0.0004  0.0007  0.0009  0.0013  ±28.11%   2041007
   ✓ intersection 11245ms
     name                   hz     min     max    mean     p75     p99    p995    p999     rme   samples
     enum set    13,479,271.68  0.0001  0.0434  0.0001  0.0001  0.0001  0.0001  0.0002  ±0.09%  13146379   fastest
     native set   2,177,543.80  0.0004  0.5098  0.0005  0.0005  0.0006  0.0009  0.0013  ±0.53%   2095524
   ✓ difference 11605ms
     name                   hz     min     max    mean     p75     p99    p995    p999     rme   samples
     enum set    12,995,829.54  0.0001  0.0500  0.0001  0.0001  0.0001  0.0001  0.0002  ±0.08%  12686534   fastest
     native set   3,268,488.39  0.0003  0.2600  0.0003  0.0003  0.0005  0.0006  0.0009  ±0.31%   3157496
   ✓ symmetricDifference 12094ms
     name                   hz     min     max    mean     p75     p99    p995    p999     rme   samples
     enum set    12,867,676.85  0.0001  0.0909  0.0001  0.0001  0.0001  0.0001  0.0002  ±0.09%  12547687   fastest
     native set   4,651,700.61  0.0002  0.3859  0.0002  0.0002  0.0003  0.0003  0.0007  ±0.49%   4461393
   ✓ isSubsetOf 16810ms
     name                   hz     min     max    mean     p75     p99    p995    p999     rme   samples
     enum set    21,557,980.46  0.0000  0.2096  0.0000  0.0001  0.0001  0.0001  0.0001  ±0.11%  20919645   fastest
     native set   5,211,373.64  0.0002  0.2351  0.0002  0.0002  0.0002  0.0003  0.0004  ±0.21%   5063952
   ✓ isSupersetOf 13393ms
     name                   hz     min     max    mean     p75     p99    p995    p999     rme   samples
     enum set    15,174,136.79  0.0000  0.1412  0.0001  0.0001  0.0001  0.0001  0.0001  ±0.18%  14688273   fastest
     native set   4,864,871.32  0.0002  0.1276  0.0002  0.0002  0.0002  0.0004  0.0004  ±0.10%   4773507
   ✓ isDisjointFrom 13695ms
     name                   hz     min     max    mean     p75     p99    p995    p999     rme   samples
     enum set    16,573,794.64  0.0000  0.2384  0.0001  0.0001  0.0001  0.0001  0.0001  ±0.09%  16216523   fastest
     native set   4,658,009.13  0.0002  0.0531  0.0002  0.0002  0.0003  0.0003  0.0004  ±0.08%   4583916
```

</details>

To run the benchmark:
```shell
npm run benchmark
```