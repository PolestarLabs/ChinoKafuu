import { ButtonEvent } from './ButtonEvent'

export class InteractionPacket {
  constructor(data) {
    this.token = data.token
    this.version = data.version
    this.id = data.id
    this.guildID = data.guild_id
    this.data = data.data
    this.channelID = data.channel_id
    this.applicationID = data.application_id
    this.buttonEvent = new ButtonEvent(data)
    if (data?.data?.values !== undefined) {
      this.values = data?.data?.values
    }
    if (data?.data?.custom_id !== undefined) {
      this.customID !== data?.data?.custom_id
    }
    if (data?.data?.component_type !== undefined) {
      this.componentType = data?.data?.component_type
    }
  }
}
