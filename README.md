# px-rng-crosschain-solana-pyth

> **Trust:** private educational lab (Tier B)  
> **Quest:** 018 — Solana randomness facade (Pyth Entropy or Switchboard)  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Teach a facade that **chooses** Pyth Entropy or Switchboard, builds an **unsent** Solana `request` body, bounds the fee, **fulfills once**, and accepts a Pyth price update only when `publishTime` is **strictly after** the bet.

**Real code:** `npm test` — **12 tests**. The body has `sent: false`. This repo does **not** talk to Solana, Pyth, or Switchboard, and it does **not** verify a VRF or price-update signature.

## What is true (executed)

| Rule | Result |
|------|--------|
| Provider `pyth-entropy` | program `pyth-entropy`, `sent: false` |
| Provider `switchboard` | program `switchboard-on-demand` |
| Fee | lamports in `[5_000, 50_000_000]` |
| Open set | max 32; duplicate id refused |
| Seed / randomness | 64 hex chars; seed lowercased |
| `fulfillOnce` | second call refused; proof **not** checked |
| `gatePriceUpdate` | `publishTime > betTs`; seq strictly newer; confidence ≤ 100 bps of \|price\|; expo in [-18, 8] |

```bash
npm test
```

Sibling on the EVM side: `px-rng-crosschain-evm-vrf-bridge`. Native WAX path stays `orng.wax` (`px-orng-v3-randnotify-starter`).

## Actions this lab does **not** claim

| Name you might expect on-chain | Status here |
|-------------------------------|-------------|
| Pyth Entropy `request` | shape only, unsent |
| Switchboard request | modeled as instruction `request` on `switchboard-on-demand`, unsent |
| Pyth price signature | not verified |
| Proof verification | explicitly not done |

## License

MIT — Pixel Journey
