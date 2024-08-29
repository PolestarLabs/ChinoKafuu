import { BUILD_INFO } from '../../Constants'
import { PluginExtend } from '../loaders/PluginExtend'

export class BuildStore extends PluginExtend {
  constructor() {
    super({
      name: 'buildStore',
      args: {},
      timeout: 50 * 1000
    })

  }

  async start() {
    try {
      const data = await BUILD_INFO.getCommit()
      this.$addClassState({ data: data })

      this.ready()
    } catch (err) {
      console.log(err)
      this.fail(err)
    }
  }
}
