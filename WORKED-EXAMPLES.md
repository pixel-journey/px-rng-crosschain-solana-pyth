# Worked examples — Solana entropy facade

Seed `ab`×32. Fees between `MIN_FEE_LAMPORTS` and `MAX_FEE_LAMPORTS`.

## requestRandomness

Provider `pyth-entropy` → body `sent:false`, chain `solana`, program `pyth-entropy`, instruction `request`, userSeed lowercased.

Provider `switchboard` → program `switchboard-on-demand`, still unsent.

Fee below min or above max refused. Duplicate open id refused. Bad seed `zz` refused. 33rd open request refused (`MAX_OPEN` 32).

## fulfillOnce

Id 7 fulfilled with `cd`×32 once; second call `already fulfilled`. Unknown id / short randomness refused.

## gatePriceUpdate

Bet at T0, lastSeq 1, update seq 2, publishTime T0+1, conf 50_000 on price 100_000_000, expo -8 → accepts seq 2.

| Failure | Reason |
| --- | --- |
| publishTime = T0 or earlier | not after bet |
| seq <= lastSeq | stale seq |
| conf 2_000_000 on that price | wide confidence |
| price 0 conf 0 | wide confidence |
| expo -19 | bad expo |
| different feedId | feed mismatch |

Proofs are **not** verified. Bodies are unsent teaching shapes.
