# Education — Solana RNG request facade (Pyth / Switchboard)

> **Rung:** `npm test` passes. Builds **unsent** instruction shapes and a post-bet price gate. No Solana RPC.  
> **The test is the rule.**

Providers: `pyth-entropy` and `switchboard`. Optional **price update gate** requires publishTime **strictly after** betTs (same fairness idea as the [drand](https://github.com/pixel-journey/px-rng-fallback-drand-bls-verifier) lab).

Sibling: [EVM/ORNG facade](https://github.com/pixel-journey/px-rng-crosschain-evm-vrf-bridge).

## Learning outcomes

| Level | After this file |
| --- | --- |
| Beginner | Both providers stay `sent: false` |
| Intermediate | Fee bounds, MAX_OPEN, once-fulfill |
| Masterclass | Price gate fields (seq, conf, expo, feed) after bet time |

---

## Beginner

`requestRandomness` for pyth-entropy → body.program `pyth-entropy`, sent **false**. Switchboard → `switchboard-on-demand`, sent **false**. Seed normalized lowercased.

## Intermediate

Fee must sit in `[MIN_FEE_LAMPORTS, MAX_FEE_LAMPORTS]`. Duplicate request id, bad seed, and open capacity (**33rd**) refused. First fulfill sets fulfilled; second → already fulfilled.

## Masterclass — price gate

`gatePriceUpdate` accepts only when:

- publishTime **>** betTs  
- seq **>** lastSeq  
- confidence not too wide  
- expo in allowed range  
- feedId matches (case-insensitive)

Same-second or earlier publish is a fairness bug — refused like drand’s post-bet rule.

Numbers: [WORKED-EXAMPLES.md](WORKED-EXAMPLES.md).

### What this is not

Not a production Pyth or Switchboard client. Not a WAX oracle. Not a bridge that moves entropy onto WAX automatically.
