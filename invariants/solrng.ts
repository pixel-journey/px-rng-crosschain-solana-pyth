/**
 * Cross-chain randomness facade pointed at Solana (educational).
 * Builds unsent request bodies for Pyth Entropy or Switchboard.
 * Does not sign, broadcast, or verify a live VRF proof.
 * A price-update gate refuses rounds that were already public at bet time.
 */

export const MAX_OPEN = 32;
export const MIN_FEE_LAMPORTS = 5_000n;
export const MAX_FEE_LAMPORTS = 50_000_000n;
export const MAX_CONF_BPS = 100n;
export const MIN_EXPO = -18;
export const MAX_EXPO = 8;

export type Provider = "pyth-entropy" | "switchboard";

export type OpenRequest = {
  id: bigint;
  provider: Provider;
  /** 32-byte user seed, hex */
  userSeed: string;
  feeLamports: bigint;
  fulfilled: boolean;
};

export type UnsentRequest = {
  sent: false;
  chain: "solana";
  provider: Provider;
  program: "pyth-entropy" | "switchboard-on-demand";
  instruction: "request";
  data: {
    id: string;
    userSeed: string;
    feeLamports: string;
  };
};

export type PriceUpdate = {
  feedId: string;
  price: bigint;
  conf: bigint;
  expo: number;
  publishTime: number;
  seq: number;
};

const SEED = /^[0-9a-f]{64}$/i;

export function assertSeed(seed: string): string {
  if (!SEED.test(seed)) throw new Error("userSeed must be 64 hex chars");
  return seed.toLowerCase();
}

export function assertProvider(provider: Provider): Provider {
  if (provider !== "pyth-entropy" && provider !== "switchboard") {
    throw new Error("provider must be pyth-entropy or switchboard");
  }
  return provider;
}

export function assertFee(fee: bigint): bigint {
  if (typeof fee !== "bigint") throw new Error("fee must be bigint");
  if (fee < MIN_FEE_LAMPORTS) throw new Error("fee below minimum");
  if (fee > MAX_FEE_LAMPORTS) throw new Error("fee above maximum");
  return fee;
}

export function assertId(id: bigint): bigint {
  if (typeof id !== "bigint" || id < 1n) throw new Error("id must be a positive bigint");
  return id;
}

/**
 * Open a pending request and return an unsent body.
 * Does not transmit anything.
 */
export function requestRandomness(
  open: readonly OpenRequest[],
  id: bigint,
  provider: Provider,
  userSeed: string,
  feeLamports: bigint
): { open: OpenRequest[]; body: UnsentRequest } {
  assertId(id);
  assertProvider(provider);
  const seed = assertSeed(userSeed);
  assertFee(feeLamports);
  if (open.length >= MAX_OPEN) throw new Error("too many open requests");
  if (open.some((r) => r.id === id)) throw new Error("id already open");

  const row: OpenRequest = {
    id,
    provider,
    userSeed: seed,
    feeLamports,
    fulfilled: false,
  };
  const program = provider === "pyth-entropy" ? "pyth-entropy" : "switchboard-on-demand";
  return {
    open: [...open, row],
    body: {
      sent: false,
      chain: "solana",
      provider,
      program,
      instruction: "request",
      data: {
        id: id.toString(),
        userSeed: seed,
        feeLamports: feeLamports.toString(),
      },
    },
  };
}

/**
 * Record fulfillment once. Randomness is an opaque 32-byte hex stand-in.
 * This function does not verify a Pyth or Switchboard proof.
 */
export function fulfillOnce(
  open: readonly OpenRequest[],
  id: bigint,
  randomness: string
): OpenRequest[] {
  assertId(id);
  if (!SEED.test(randomness)) throw new Error("randomness must be 64 hex chars");
  const row = open.find((r) => r.id === id);
  if (!row) throw new Error("unknown request");
  if (row.fulfilled) throw new Error("already fulfilled");
  return open.map((r) => (r.id === id ? { ...r, fulfilled: true } : r));
}

function abs(n: bigint): bigint {
  return n < 0n ? -n : n;
}

/**
 * Accept a Pyth price update as an entropy input only when:
 * - feed matches
 * - publishTime is strictly after betTs (equal is already public)
 * - sequence is strictly newer than lastSeq
 * - confidence <= 100 bps of |price| (zero price refused)
 * - expo is in [-18, 8]
 * Does not verify a Pyth signature.
 */
export function gatePriceUpdate(input: {
  expectedFeed: string;
  betTs: number;
  lastSeq: number;
  update: PriceUpdate;
}): { seq: number } {
  const feed = input.expectedFeed.toLowerCase();
  if (!SEED.test(feed)) throw new Error("bad feed");
  const got = input.update.feedId.toLowerCase();
  if (got !== feed) throw new Error("feed mismatch");
  if (!Number.isInteger(input.betTs) || input.betTs < 0) throw new Error("bad betTs");
  if (!Number.isInteger(input.update.publishTime) || input.update.publishTime <= input.betTs) {
    throw new Error("not after bet");
  }
  if (!Number.isInteger(input.lastSeq) || input.lastSeq < 0) throw new Error("bad lastSeq");
  if (!Number.isInteger(input.update.seq) || input.update.seq <= input.lastSeq) {
    throw new Error("stale seq");
  }
  if (
    !Number.isInteger(input.update.expo) ||
    input.update.expo < MIN_EXPO ||
    input.update.expo > MAX_EXPO
  ) {
    throw new Error("bad expo");
  }
  if (typeof input.update.price !== "bigint" || typeof input.update.conf !== "bigint") {
    throw new Error("bad price");
  }
  if (input.update.conf < 0n) throw new Error("wide confidence");
  const mag = abs(input.update.price);
  if (mag === 0n || input.update.conf * 10_000n > mag * MAX_CONF_BPS) {
    throw new Error("wide confidence");
  }
  return { seq: input.update.seq };
}
