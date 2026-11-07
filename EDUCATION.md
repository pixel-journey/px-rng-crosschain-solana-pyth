# Education

Quest 017 routes `requestRandomness` to `orng.wax` or an EVM VRF consumer. Quest 018 is the **same idea** pointed at Solana, plus a gate for using a Pyth price update as entropy.

| Provider | Program label in the unsent body |
|----------|----------------------------------|
| `pyth-entropy` | `pyth-entropy` |
| `switchboard` | `switchboard-on-demand` |

A price that was already published at `betTs` can be ground against. `gatePriceUpdate` therefore requires `publishTime > betTs` (equal is refused), a strictly newer `seq`, and confidence no wider than 100 bps of `|price|`. A zero price is refused because the confidence ratio is undefined.

## What a future agent should not invent

- Do not mark `body.sent` true. Nothing was broadcast.
- Do not treat `fulfillOnce` or `gatePriceUpdate` as signature verification.
- Do not reuse `orng.wax` action names for this quest.
- Fee units are **lamports**, not WAX (8 decimals) and not LINK.
