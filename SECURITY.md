# Security — Solana entropy facade and price-time gate

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Fee out of range | refused |
| Bad seed / duplicate id / capacity | refused |
| Second fulfill | already fulfilled |
| `publishTime ≤ betTs` | not after bet |
| Stale seq / wide conf / bad expo / feed mismatch | refused |

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Cryptographic verify | Real Pyth / Switchboard verification |
| RPC trust | Official endpoints, not client-supplied accounts |
| Cross-chain relay | Who posts entropy onto WAX and with what auth |
| Ed25519 / attestation | Not in this lab |

## Attack angles

1. Using the **price** as the random number (market print ≠ entropy request).
2. Accepting a stale print because it is "close" to bet time (`>=` instead of `>`).
3. Routing preferred and fallback to the same program id.
4. Porting this to WAX and skipping `orng.wax`.
5. Treating `conf = 0` and `price = 0` as a production "tight" feed without a written policy.

## Honesty limits

Unsent bodies only. Same strict time idea as [drand](https://github.com/pixel-journey/px-rng-fallback-drand-bls-verifier). Prefer [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng) on WAX. Related: [EVM facade](https://github.com/pixel-journey/px-rng-crosschain-evm-vrf-bridge).
