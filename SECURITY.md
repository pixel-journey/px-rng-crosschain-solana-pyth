# Security notes

| Issue | Lab mitigation |
|-------|----------------|
| Wrong provider string | only `pyth-entropy` or `switchboard` |
| Unbounded pending table | MAX_OPEN 32 |
| Fee drain or zero fee | lamport min/max |
| Replay fulfillment | `fulfilled` flag |
| Price already public at bet time | `publishTime <= betTs` refused |
| Replayed update | `seq <= lastSeq` refused |
| Wide or zero price | confidence > 100 bps, or price 0, refused |
| Forged proof | not accepted — no signature check |

Not claimed: live Pyth/Switchboard, program ids, account metas, wasm.
