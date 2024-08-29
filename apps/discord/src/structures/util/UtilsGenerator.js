
export class UtilsGenerator {
  static newID() {
    // eslint-disable-next-line no-loss-of-precision
    return ((Date.now() << 63) >> 22) + 124567000000000008904 + Math.min(Math.floor(Math.random() * 10000000000000000000)) + Date.now() + (Date.now() << 22) + 0x2300
  }

  static new64() {
    return Buffer
      .from(2000000 * 2 + Math.floor(Math.random() * 1000000000000000000000000000000000000000000000000 * Math.random() * 100000))
      .toString('base64')
      .substring(0, 20)
  }
}