# Solana randomness facade: Pyth Entropy or Switchboard

> **Domain:** cross-chain Solana randomness  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Path:** [ORNG-LEARNING-PATH.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/ORNG-LEARNING-PATH.md)

**Goal:** Choose Pyth Entropy or Switchboard, build an **unsent** Solana request, bound fees, **fulfill once**, and accept a price update only when `publishTime` is **strictly after** the bet (plus seq/conf/expo gates).

**Code under test:** `npm test`. No Solana RPC, no signature verification.

**Docs:** [Pyth](https://docs.pyth.network/), [Switchboard](https://docs.switchboard.xyz/). **WAX primary:** [orng.wax](https://github.com/worldwide-asset-exchange/wax-orng).

## Learning materials

| Doc | Role |
| --- | --- |
| [EDUCATION.md](EDUCATION.md) | Beginner → masterclass |
| [WORKED-EXAMPLES.md](WORKED-EXAMPLES.md) | Route, fulfill, price gate |
| [TIPS.md](TIPS.md) | Prefer orng on WAX |
| [SECURITY.md](SECURITY.md) | Bounds; no proof verify |
| [SOURCES.md](SOURCES.md) | Official |

```bash
npm test
```

MIT — Pixel Journey
