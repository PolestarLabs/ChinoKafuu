import { StateApplicationI } from '../../index'
import { RevoltClient } from '../Revolt'


export class Hotreload {
  revoltClient: RevoltClient
  state?: StateApplicationI
  constructor(client?: RevoltClient, stateApplication?: StateApplicationI) {
    this.revoltClient = client!!
    this.state = stateApplication
  }

  reload() {
    // Delete cache
  }

  private clearAllCache() {
    this.revoltClient.clearCache()
  }
}