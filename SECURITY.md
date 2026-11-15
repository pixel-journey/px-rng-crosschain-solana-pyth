# Security — Solana RNG facade

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Fee out of range | refused |
| Bad seed / duplicate id / capacity | refused |
| Second fulfill | already fulfilled |
| publishTime ≤ betTs | not after bet |
| stale seq / wide conf / bad expo / feed mismatch | refused |

## Not closed

| Concern | Guidance |
| --- | --- |
| Cryptographic verify | Real Pyth/Switchboard verification |
| RPC trust | Official endpoints, not client-supplied accounts |
| Cross-chain relay | Who posts entropy onto WAX and with what auth |

Unsent bodies only in this repository.
