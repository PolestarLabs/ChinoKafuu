export class ColorResolver {
  /**
     * @param color {string} The color to be resolved
     * @returns {string | Error}
     */
  static resolve(color) {
    if (typeof (color) !== 'string') throw new Error(`Unexpected type ${typeof color} while building the embed`)
    color = color.toUpperCase()
    const defaultColors = {
      DEFAULT: 0x7DAFFF,
      ERROR: 0xFA704D,
      MINECRAFT: 0x7BE37B,
      MODERATION: 0xFF4A4A,
      ACTION: 0xC68AFF,
      ANIMU: 0x7800FF
    }

    if (!color) color = null
    if (defaultColors[typeof color === 'number' ? defaultColors.DEFAULT : color]) {
      return defaultColors[typeof color === 'number' ? defaultColors.DEFAULT : color]
    }

    return parseInt(color.replace('#', ''), 16)
  }
}
