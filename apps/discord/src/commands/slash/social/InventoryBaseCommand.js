import { CommandBase, CommandOptions } from 'eris'
import { Command } from '../../../structures/util'

export default class InventoryBaseCommand extends Command {
  constructor() {
    super({
      name: 'inventory',
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }],
      isBase: true,
      slash: new CommandBase()
        .setName('inventory')
        .setDescription('To manage inventory')
        .addOptions(
          new CommandOptions()
            .setType(1)
            .setName('profile')
            .setDescription('Change profiles that you\'ve purchased or that you already have.'),
          new CommandOptions()
            .setType(1)
            .setName('background')
            .setDescription('Change background that you\'ve purchased or that you already have.'),
        )
    })
  }
}