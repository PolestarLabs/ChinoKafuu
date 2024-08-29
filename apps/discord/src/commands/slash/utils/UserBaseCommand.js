import { CommandBase, CommandOptions } from 'eris'
import { Command } from '../../../structures/util'

export default class UserBaseCommand extends Command {
  constructor() {
    super({
      name: 'user',
      aliases: [],
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }],
      isBase: true,
      slash: new CommandBase()
        .setName('user')
        .setDescription('Shows some information about a user.')
        .addOptions(
          new CommandOptions()
            .setType(1)
            .setName('avatar')
            .setDescription('Shows your avatar or someone else\'s.')
            .addOptions(
              new CommandOptions()
                .setType(6)
                .setName('user')
                .setDescription('Mention the member on the server.'),
              new CommandOptions()
                .setType(5)
                .setName('guild-avatar')
                .setDescription('Shows the guild avatar of the member.')
            ),
          new CommandOptions()
            .setType(1)
            .setName('banner')
            .setDescription('Gets the banner of an user.')
            .addOptions(
              new CommandOptions()
                .setType(6)
                .setName('user')
                .setDescription('Mention the user that you want.')
            ),
          new CommandOptions()
            .setType(1)
            .setName('info')
            .setDescription('Shows some information about a user.')
            .addOptions(
              new CommandOptions()
                .setType(6)
                .setName('user')
                .setDescription('Mention a user.')
            )
        )
    })
  }
}
