export function uuidV1ToDate(uuid: string): Date | null {
  const version = parseInt(uuid[14], 16);
  if (version !== 1) return null; // Não é UUID v1

  const timeLow = BigInt('0x' + uuid.slice(0, 8));
  const timeMid = BigInt('0x' + uuid.slice(9, 13));
  const timeHiAndVersion = BigInt('0x' + uuid.slice(14, 18));

  const timestamp = ((timeHiAndVersion & 0x0fffn) << 48n) | (timeMid << 32n) | timeLow;

  // UUID v1 epoch starts from 1582-10-15
  //   const uuidEpoch = BigInt(Date.UTC(1582, 9, 15)); // mês 9 = outubro
  const gregorianOffset = 0x01b21dd213814000n; // 122192928000000000n (100ns units)

  const msSinceEpoch = (timestamp - gregorianOffset) / 10000n;
  return new Date(Number(msSinceEpoch));
}
