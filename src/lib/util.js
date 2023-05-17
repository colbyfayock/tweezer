/**
 * createHashFromString
 * @via https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
 */

export async function createHashFromString(data, algorithm = 'SHA-256') {
  if (!data) throw new Error('Failed to create hash. Data undefined.');
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest(algorithm, encoder.encode(data))
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}