String.prototype.searchJSON = function () {
  const time = Date.now()
  const matches = this.match(/{.*}|\[.*\]/g)
  return {
    time: Date.now() - time,
    matches: matches
  }
}

String.prototype.buffer = function (out) {
  if (out === undefined) return Buffer.from(this, out)
  return Buffer.from(this)
}

String.prototype.byteLength = function (out) {
  if (out === undefined) return Buffer.from(this, out).byteLength
  return Buffer.from(this).byteLength
}

String.prototype.removePath = function () {
  const getPath = import.meta.url.replace('//', '')
    .replace('\\\\', '')
    .replace('./', '/')
    .replace('.\\', '\\')
  const str = this
    .replace('\\\\', '\\')
    .replace('./', '/')
    .replace('.\\', '\\')
    .split('\n')
  const a = []
  for (const b of str) {
    a.push(
      b
        .replace(getPath, '')
        .replace(/\\/g, '/')
    )
  }
  return a.join('\n')

}

String.prototype.isUpperCase = function () {
  return this === this.toUpperCase()
}

String.prototype.isLowerCase = function () {
  return this === this.toLocaleLowerCase()
}

String.prototype.convertToColor = function () {
  if (this.startsWith('#')) {
    return Number(`0x${this}`.replace('#',''))
  }
  return 0
}

String.prototype.toTitle = function () {
  return this
    .split(/\s+|\n/)
    .map((str) => str.split('').map((s, n) => (n == 0) ? s.toUpperCase() : s.toLocaleLowerCase()).join(''))
    .join(' ')
    .split(' ')
    .map((str) => str.length == 2 ? str.toUpperCase() : str)
    .join(' ')
}

Object.prototype.toJSONString = function () {
  return JSON.stringify(this)
}