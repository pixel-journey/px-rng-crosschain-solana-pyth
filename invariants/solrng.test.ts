import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  requestRandomness,
  fulfillOnce,
  gatePriceUpdate,
  MAX_OPEN,
  MIN_FEE_LAMPORTS,
  MAX_FEE_LAMPORTS,
  type OpenRequest,
  type PriceUpdate,
} from "./solrng.ts";

const seed = "ab".repeat(32);
const rand = "cd".repeat(32);
const T0 = 1_700_000_000;

function upd(over: Partial<PriceUpdate> = {}): PriceUpdate {
  return {
    feedId: seed,
    price: 100_000_000n,
    conf: 50_000n,
    expo: -8,
    publishTime: T0 + 30,
    seq: 2,
    ...over,
  };
}

describe("requestRandomness", () => {
  it("builds an unsent pyth body", () => {
    const { open, body } = requestRandomness([], 1n, "pyth-entropy", seed, 10_000n);
    assert.equal(body.sent, false);
    assert.equal(body.chain, "solana");
    assert.equal(body.program, "pyth-entropy");
    assert.equal(body.instruction, "request");
    assert.equal(body.data.userSeed, seed);
    assert.equal(open.length, 1);
    assert.equal(open[0].fulfilled, false);
  });

  it("routes switchboard to its program name", () => {
    const { body } = requestRandomness([], 2n, "switchboard", seed, MIN_FEE_LAMPORTS);
    assert.equal(body.program, "switchboard-on-demand");
    assert.equal(body.provider, "switchboard");
    assert.equal(body.sent, false);
  });

  it("lowercases seed", () => {
    const { body } = requestRandomness([], 3n, "pyth-entropy", seed.toUpperCase(), 10_000n);
    assert.equal(body.data.userSeed, seed);
  });

  it("refuses fee below minimum and above maximum", () => {
    assert.throws(
      () => requestRandomness([], 1n, "pyth-entropy", seed, MIN_FEE_LAMPORTS - 1n),
      /minimum/
    );
    assert.throws(
      () => requestRandomness([], 1n, "pyth-entropy", seed, MAX_FEE_LAMPORTS + 1n),
      /maximum/
    );
  });

  it("refuses duplicate id and bad seed", () => {
    const { open } = requestRandomness([], 1n, "pyth-entropy", seed, 10_000n);
    assert.throws(() => requestRandomness(open, 1n, "switchboard", seed, 10_000n), /already open/);
    assert.throws(() => requestRandomness([], 4n, "pyth-entropy", "zz", 10_000n), /hex/);
  });

  it("refuses a 33rd open request", () => {
    let open: OpenRequest[] = [];
    for (let i = 1; i <= MAX_OPEN; i++) {
      open = requestRandomness(open, BigInt(i), "pyth-entropy", seed, 10_000n).open;
    }
    assert.equal(open.length, MAX_OPEN);
    assert.throws(
      () => requestRandomness(open, BigInt(MAX_OPEN + 1), "pyth-entropy", seed, 10_000n),
      /too many/
    );
  });
});

describe("fulfillOnce", () => {
  it("fulfills once and refuses a second call", () => {
    const { open } = requestRandomness([], 7n, "pyth-entropy", seed, 10_000n);
    const next = fulfillOnce(open, 7n, rand);
    assert.equal(next[0].fulfilled, true);
    assert.throws(() => fulfillOnce(next, 7n, rand), /already fulfilled/);
  });

  it("refuses unknown id and short randomness", () => {
    assert.throws(() => fulfillOnce([], 1n, rand), /unknown/);
    const { open } = requestRandomness([], 1n, "pyth-entropy", seed, 10_000n);
    assert.throws(() => fulfillOnce(open, 1n, "abcd"), /64 hex/);
  });
});

describe("gatePriceUpdate", () => {
  it("accepts a strictly later, tight update and returns seq", () => {
    const g = gatePriceUpdate({
      expectedFeed: seed.toUpperCase(),
      betTs: T0,
      lastSeq: 1,
      update: upd({ seq: 2, publishTime: T0 + 1 }),
    });
    assert.equal(g.seq, 2);
  });

  it("refuses publishTime equal to or before the bet", () => {
    assert.throws(
      () =>
        gatePriceUpdate({
          expectedFeed: seed,
          betTs: T0,
          lastSeq: 0,
          update: upd({ publishTime: T0 }),
        }),
      /not after bet/
    );
    assert.throws(
      () =>
        gatePriceUpdate({
          expectedFeed: seed,
          betTs: T0,
          lastSeq: 0,
          update: upd({ publishTime: T0 - 1 }),
        }),
      /not after bet/
    );
  });

  it("refuses stale seq, wide confidence, and bad expo", () => {
    assert.throws(
      () =>
        gatePriceUpdate({
          expectedFeed: seed,
          betTs: T0,
          lastSeq: 5,
          update: upd({ seq: 5 }),
        }),
      /stale seq/
    );
    assert.throws(
      () =>
        gatePriceUpdate({
          expectedFeed: seed,
          betTs: T0,
          lastSeq: 0,
          update: upd({ conf: 2_000_000n }),
        }),
      /wide confidence/
    );
    assert.throws(
      () =>
        gatePriceUpdate({
          expectedFeed: seed,
          betTs: T0,
          lastSeq: 0,
          update: upd({ price: 0n, conf: 0n }),
        }),
      /wide confidence/
    );
    assert.throws(
      () =>
        gatePriceUpdate({
          expectedFeed: seed,
          betTs: T0,
          lastSeq: 0,
          update: upd({ expo: -19 }),
        }),
      /bad expo/
    );
  });

  it("refuses a different feed", () => {
    assert.throws(
      () =>
        gatePriceUpdate({
          expectedFeed: seed,
          betTs: T0,
          lastSeq: 0,
          update: upd({ feedId: "ff".repeat(32) }),
        }),
      /feed mismatch/
    );
  });
});
