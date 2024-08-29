
// eslint-disable-next-line no-unused-vars
import { Database } from '../Database'
import { DBMouse } from './TypingCommandSearch'
/**
 * Recently BSON has had problems querying large data. Therefore, there are limits to avoid problems in the query. Errors presented are:
 *
 *  MongoServerError: BSONObj size: 17562505(0x10BFB89) is invalid.Size must be between 0 and 16793600(16MB) First element: find: "model_test"
 *
 *
 * RangeError [ERR_OUT_OF_RANGE]: The value of "offset" is out of range. It must be >= 0 && <= 17825792. Received 17825794
    at validateOffset (node:buffer:115:3)
    at Buffer.write (node:buffer:1070:5)
 */
const CONSTANT_MAX_QUERY_SUPPORTED_BY_BSON = 819600

/**
 * @typedef {object} ValueTypeDef
 * @property { 'greaterThanOrEqual' | '_in' | 'booleanValue'} type
 * @property {any[] |string |number} value
*/
/**
 * @template T
 * @typedef {object} FilterTypeDef
 * @property {keyof T} property
 * @property {ValueTypeDef} filterCommand
 */
/**
 * @template T
 */
export default class ISearchType {
  /**
   *
   * @param {Database} database
   * @param {'users' | 'commands' | 'guilds'} type
   * @property {T} model
   */
  constructor(database, type = '') {
    this.database = database
    if (type === 'users') {
      this.model = this.database.users.model
    } else if (type === 'commands') {
      this.model = this.database.commands.model
    } else if (type === 'guilds') {
      this.model = this.database.guilds.model
    }
  }

  static new(database) {
    return new ISearchType(database)
  }

  /**
   *  This function was developed to load a list of corresponding IDs more easily and practically, with simple filters and an amazing interface.
   *  Just remember, you need to use this function carefully. There are limitations related to BSON
   *  ```js
   *  const CONSTANT_MAX_QUERY_SUPPORTED_BY_BSON = 819600
   *  ```
   *  and it seems that it can only query up to 819,600 data,
   *  of course depending on the amount of memory you have on your machine to load an Array with this amount.
   *  Besides that, data retrieval is low latency.
   *
   * @property {this.model} model
   * @param {string[]} id
   * @param {FilterTypeDef<T>[]} filters
   * @param {Array.<keyof T>} limitInField
   * @param {import('mongoose').QueryOptions} options
   * @returns {Promise<T[]>}
   */
  async matchingIds(id = [], filters = [], limitInField = [], options = {}) {
    const ids = Array.isArray(id) ? id.filter((i) => typeof i === 'string') : []
    const and = []

    if (Array.isArray(filters)) {
      for (const filter of filters) {
        and.push(Object.assign({}, Object.fromEntries([[filter.property, DBMouse.selectTypeMouse(filter.filterCommand.type, filter.filterCommand.value)]])))
      }
    }

    return await this.model.find({
      $and: [
        { id: { $in: ids.slice(0, CONSTANT_MAX_QUERY_SUPPORTED_BY_BSON) } },
        ...and
      ],
    }, Array.isArray(limitInField) && (limitInField?.length ?? 0) >= 1 ? DBMouse.selectValue(limitInField) : undefined, options ?? {})
  }
}