import { CommandBase, CommandOptions } from 'eris'
import { Command } from '../../../structures/util'

export default class ServerBaseCommand extends Command {
  constructor() {
    super({
      name: 'server',
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }],
      isBase: true,
      slash: new CommandBase()
        .setName('server')
        .setDescription('Shows some informations about the current server.')
        .addOptions(
          new CommandOptions()
            .setType(1)
            .setName('banner')
            .setDescription('Get the current server\'s banner (if available).'),
          new CommandOptions()
            .setType(1)
            .setName('icon')
            .setDescription('Get the current server\'s icon (if it have one).'),
          new CommandOptions()
            .setType(1)
            .setName('info')
            .setDescription('Shows more information about the current server.')
        )
    })
  }
}