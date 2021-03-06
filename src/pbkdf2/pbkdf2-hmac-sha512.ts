import { HmacSha512 } from '../hmac/hmac-sha512';

export function Pbkdf2HmacSha512(password: Uint8Array, salt: Uint8Array, count: number, length: number): Uint8Array {
  const hmac = new HmacSha512(password);

  const result = new Uint8Array(length);

  const blocks = Math.ceil(length / hmac.HMAC_SIZE);

  for (let i = 1; i <= blocks; ++i) {
    const j = (i - 1) * hmac.HMAC_SIZE;
    const l = (i < blocks ? 0 : length % hmac.HMAC_SIZE) || hmac.HMAC_SIZE;

    hmac.reset().process(salt);
    hmac.hash.asm.pbkdf2_generate_block(hmac.hash.pos, hmac.hash.len, i, count, 0);

    result.set(hmac.hash.heap.subarray(0, l), j);
  }

  return result;
}
