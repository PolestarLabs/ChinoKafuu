import { EventEmitter } from 'events'

export interface ClientI { }

export class ClientInterface extends EventEmitter {
  constructor(secret: string, options: ClientI) {
    super()
  }
}

export class ClientBase extends ClientInterface {
  constructor(secret: string, options: ClientI) {
    super(secret, options)
  }
}

export class RevoltClient extends ClientBase {
  constructor(secret: string, options: ClientI) {
    super(secret, options)

  }

  clearCache() { }

  // Disconnect all websocket client.
  shutdown() { }

  build() {
    console.log('Starting revolt!')
    return this
  }
}