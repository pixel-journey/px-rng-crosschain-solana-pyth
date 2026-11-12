# px-rng-crosschain-solana-pyth

> **Trust:** private educational lab (Tier B)  
> **Domain:** cross-chain Solana randomness facade  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Teach a facade that **chooses** Pyth Entropy or Switchboard, builds an **unsent** Solana `request` body, bounds the fee, **fulfills once**, and accepts a Pyth price update only when `publishTime` is **strictly after** the bet.

**Real code:** `npm test` (12 tests). Does **not** talk to Solana or verify signatures.

Docs: [Pyth](https://docs.pyth.network/), [Switchboard](https://docs.switchboard.xyz/). WAX primary: [orng.wax](https://github.com/worldwide-asset-exchange/wax-orng). Sibling: [EVM VRF bridge](https://github.com/pixel-journey/px-rng-crosschain-evm-vrf-bridge).

## What is true (executed)

| Rule | Result |
|------|--------|
| Provider routing | unsent bodies for pyth-entropy / switchboard |
| Fee / open set / seed | bounded; max 32 open; 64 hex |
| `fulfillOnce` | second call refused; proof not checked |
| `gatePriceUpdate` | publishTime > betTs; seq; conf ≤ 100 bps; expo bounds |

```bash
npm test
```

MIT — Pixel Journey
