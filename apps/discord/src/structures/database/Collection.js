/**
 * @class
 * @template T
 */
export class Collection {
  /**
   * @constructor
   * @param {T} model
   */
  constructor(model) {
    /**
     * @type {import('mongoose').Model}
     */
    this.model = model
  }

  /**
     *
     * @param id
     * @returns {*}
     */
  findOneByID(id) {
    return this.findOne({ id })
  }

  /**
     *
     * @param args
     */
  findOne(...args) {
    return this.model.findOne(...args)
  }

  /**
     *
     * @param id
     * @returns {Promise<Promise|void|*>}
     */
  async getAndDelete(id) {
    const data = await this.findOneByID(id)
    if (data) {
      return this.model.findOneAndDelete({ id })
    } else {
      return undefined
    }
  }

  async find() {

  }

  /**
     *
     * @param id
     * @param defaultValues
     * @returns {Promise<Promise|void|*>}
     */
  async getOrCreate(id, defaultValues = {}) {
    const data = await this.findOneByID(id)
    if (!data) {
      return this.model({ id, ...defaultValues }).save()
    }
    return data
  }
}
