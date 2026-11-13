# Worked examples — Solana facade

## Example A — open request

Valid seed + fee → body with program `pyth-entropy` or `switchboard-on-demand`.

## Example B — fee bounds

Below MIN or above MAX lamports → refused.

## Example C — fulfill once

First ok; second → `already fulfilled`.

## Example D — price after bet

publishTime 1001, betTs 1000 → seq returned. publishTime 1000 → `not after bet`.

## Example E — wide confidence

conf * 10000 > |price| * 100 → `wide confidence`.

## Example F — stale seq

seq ≤ lastSeq → refused.
