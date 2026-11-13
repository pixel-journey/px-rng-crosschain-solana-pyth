# Education — Solana Pyth / Switchboard facade

> **Rung:** `npm test` passes. **Unsent** Solana request bodies; fulfill is once-only.  
> Price-update gate is a **timing/quality** filter, not a signature verifier.

## What you should be able to do

| Level | Skill |
| --- | --- |
| Beginner | Route to pyth-entropy or switchboard |
| Intermediate | Fee bounds, max open, seed format |
| Masterclass | `gatePriceUpdate`: after bet, newer seq, conf ≤ 100 bps |

## Beginner

`requestRandomness` appends an open row and returns `{ sent: false, chain: "solana", ... }`.

## Intermediate

`fulfillOnce` refuses unknown id and second fulfill. Randomness is opaque 64-hex — **no proof check**.

## Masterclass

`gatePriceUpdate` requires matching feed, `publishTime > betTs`, strictly increasing seq, expo in [-18, 8], and confidence not wider than 100 bps of |price|. Equal publish time is already public → refused.

## Will not teach

Live Solana RPC, Pyth/Switchboard cryptographic verification, or replacing orng.wax on WAX.
