
export default class SlashCommandManager {
  constructor(client) {
    this._client = client
    this.commands = []
  }

  async fetchCommands() {
    const commandRest = await this._client.requestHandler.request('GET', `/applications/${this._client.user.id}/commands`, true, undefined, null)
    const commands = commandRest.map((i) => ({ name: i.name, id: i.id, mention: `</${i.name}:${i.id}>`, ...i }))
    this.commands.push(...commands)
    return this.commands
  }

  resetCommands() {
    console.log('You have reset the commands! A restart of the Application is required.')
    this._client.requestHandler.request('PUT', `/applications/${this._client.user.id}/commands`, true, [], null)
  }
}