const prepareTimestamp = (time) => {
  const seconds = Math.floor(time / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const years = Math.floor(weeks / 365)

  return [
    { d: seconds, t: 'second', prefix: 's', p: 60 },
    { d: minutes, t: 'minute', prefix: 'm', p: 60 },
    { d: hours, t: 'hour', prefix: 'h', p: 24 },
    { d: days, t: 'day', prefix: 'd', p: 0 },
    { d: weeks, t: 'week', prefix: 'w', p: 0 },
    { d: years, t: 'year', prefix: 'y', p: 0 }
  ]
}

export const TimeString = (time) => {
  const format = prepareTimestamp(time)
    .filter((t) => t.d > 0)
    .filter((t) => (t.d % t.p) > 0)
  const timeFormat = format
    .reverse()
    .map((i) => `${i.d % i.p} ${i.t + (format.length === 0 || (i.d % i.p) > 1 ? 's' : '')}`)
    .join(', ')
  return timeFormat.length > 0 ? timeFormat : '{{0}}'
}

export const TimeStringLocale = (time, _locale) => {
  const format = prepareTimestamp(time)
    .filter((t) => t.d >= 1)
    .filter((t) => (t.p === 0 ? t.d : t.d % t.p) >= 1)
  const timeFormat = format
    .reverse()
    .map((i, index) => {
      const m = (i.p === 0 ? i.d : (i.d % i.p))
      const size = Math.max(format.length - 1, 0)
      const checkValue = !(format.length <= 1) && index >= size - 1
      const removePrefix = _locale(`basic:timestamp.${i.t}${m > 1 && !(format.length <= 1) ? 's' : ''}`).includes('{-}')
      const prefix = index === size - 1 && format.at(size - 1)
      const strPrefix = prefix ? _locale('basic:timestamp.prefix') : (index >= size ? '' : ', ')

      return _locale(`basic:timestamp.${i.t}${checkValue && m > 1 ? 's' : ''}`, {
        0: m.toLocaleString(),
        1: removePrefix ? '' : strPrefix
      })
        .replace(/\{space\}/g, prefix ? ' ' : '')
        .replace(/\{-\}/g, '')
    })
  return timeFormat.length > 0 ? timeFormat.join('').replace(/\s+$/, '') : '{{0}}'
}