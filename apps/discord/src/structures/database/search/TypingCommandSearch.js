
export const TypingCommandSearch = [
  ['>=', 0, '>=<value>', false, false, '$gte'],
  ['(limit):', 1, '(limit):<value>', false, false, '$limit'],
  ['(sort):', 2, '(sort):<value>', false, false, '$sort'],
  [null, 3, '[{...fields}]', true, false, '$in'],
  [null, 4, 'false?true', false, true, '$ne'],
]

export const greaterThanOrEqual = (value) => ({ $gte: typeof value === 'number' ? value : 0 })
export const limit = (value) => ({ $limit: typeof value === 'number' ? value : 100 })
export const sort = (value) => ({ $sort: typeof value === 'number' ? value : -1 })
export const _in = (value) => ({ $in: Array.isArray(value) ? value : [] })
export const booleanValue = (value) => ({ $ne: typeof value === 'boolean' ? value : false })

/**
 * ## **Do not use this function for user input or any third-party API or library. This function is intended for use with certain appropriate and secure code!!!**
 */
export const selectValue = (value = ['']) => {
  const values = value.filter((i) => typeof i === 'string')
  const obj = {
    _id: 0
  }

  for (const i of values) {
    if (!i.startsWith('_id')) {
      Object.assign(obj, Object.fromEntries([[i, 1]]))
    }
  }
  return obj
}

export const DBMouse = {
  greaterThanOrEqual,
  limit,
  sort,
  _in,
  booleanValue,
  selectValue,
  selectTypeMouse: (type, value) => {
    if (type === 'greaterThanOrEqual') {
      return greaterThanOrEqual(value)
    } else if (type === 'limit') {
      return limit(value)
    } else if (type === '_in') {
      return _in(value)
    } else if (type === 'booleanValue') {
      return booleanValue(value)
    } else if (type === 'sort') {
      return sort(value)
    }

    throw new Error('This function is unknown or not yet compatible.')
  }
}