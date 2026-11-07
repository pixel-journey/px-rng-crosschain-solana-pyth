import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  requestRandomness,
  fulfillOnce,
  MAX_OPEN,
  MIN_FEE_LAMPORTS,
  MAX_FEE_LAMPORTS,
  type OpenRequest,
} from "./solrng.ts";

const seed = "ab".repeat(32);
const rand = "cd".repeat(32);

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
