# Security notes

| Issue | Lab mitigation |
|-------|----------------|
| Wrong provider string | only `pyth-entropy` or `switchboard` |
| Unbounded pending table | MAX_OPEN 32 |
| Fee drain or zero fee | lamport min/max |
| Replay fulfillment | `fulfilled` flag |
| Forged "proof" | not accepted — function does not verify |

Production still needs the real program id, account metas, a verified callback, and a WAX-side record that the Solana randomness was published **after** the bet. None of that is claimed here.
