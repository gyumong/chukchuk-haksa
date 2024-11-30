/** 랜덤 문자열 생성 (Nonce 등) */
function generateRandomString(length: number = 32): string {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => ('0' + byte.toString(16)).slice(-2)).join('');
}

/** SHA256 해싱 함수 */
async function hashSHA256(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  // Uint8Array를 hex 문자열로 변환
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/** 랜덤 Nonce 생성 */
function generateRandomNonce(length: number = 32): string {
  return generateRandomString(length);
}

/** Nonce 해싱 함수 */
async function hashNonce(nonce: string): Promise<string> {
  return await hashSHA256(nonce);
}

export { generateRandomString, hashSHA256, generateRandomNonce, hashNonce };
