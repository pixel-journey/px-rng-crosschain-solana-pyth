# Worked examples — Solana RNG facade

Unsent instruction bodies only. Seed `ab`×32, randomness `cd`×32, `T0 = 1_700_000_000`.

## requestRandomness

| Provider | body.program | body.sent |
| --- | --- | --- |
| pyth-entropy | pyth-entropy | false |
| switchboard | switchboard-on-demand | false |

Fee must sit in `[MIN_FEE_LAMPORTS, MAX_FEE_LAMPORTS]`. Seed uppercased is stored lowercased. Duplicate id, bad seed `zz`, and **33rd** open request refused (`MAX_OPEN`).

## fulfillOnce

First fulfill sets `fulfilled true`. Second → already fulfilled. Unknown id / short randomness refused.

## gatePriceUpdate

Accept when publishTime **strictly after** betTs, seq > lastSeq, confidence tight, expo in range, feed matches (case-insensitive).

| Case | Error |
| --- | --- |
| publishTime = betTs or earlier | not after bet |
| seq ≤ lastSeq | stale seq |
| conf 2_000_000 | wide confidence |
| price 0 conf 0 | wide confidence |
| expo -19 | bad expo |
| different feedId | feed mismatch |

Not live Solana RPC. Not production Pyth/Switchboard clients.
