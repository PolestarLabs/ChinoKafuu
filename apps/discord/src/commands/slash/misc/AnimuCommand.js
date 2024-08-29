import { Command } from '../../../structures/util'
import { CommandBase, CommandOptions } from 'eris'

export default class AnimuCommand extends Command {
  constructor() {
    super({
      name: 'animu',
      aliases: ['moeanimu'],
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }],
      isBase: true,
      slash: new CommandBase()
        .setName('animu')
        .setDescription('Starts the Animu Radio')
        .addOptions(
          new CommandOptions()
            .setType(1)
            .setName('leave')
            .setDescription('Disconnect Chino Kafuu in the voice channel.'),
          new CommandOptions()
            .setType(1)
            .setName('nowplaying')
            .setDescription('Show what\'s playing on Animu'),
          new CommandOptions()
            .setType(1)
            .setName('volume')
            .setDescription('Change the volume sound.')
            .addOptions(
              new CommandOptions()
                .setType(4)
                .setName('value')
                .setDescription('The value of the volume')
                .isRequired()
            ),
          new CommandOptions()
            .setType(1)
            .setName('play')
            .setDescription('Play Animu music on voice channel.'),
        )
    })
  }
}
