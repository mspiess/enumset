# EnumSet

A specialized [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) implementation
for use with numerical enum types.
All state is packed into a single 32-bit integer bitfield.

## Caveats

- All enum values must be integers in the interval [0,32). This is enforced through TypeScript.
- Iteration order breaks the [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
    contract. The methods `forEach`, `keys`, `values` and `[Symbol.iterator]` iterate in the ascending order of the enum
    values and *not* in insertion order.
