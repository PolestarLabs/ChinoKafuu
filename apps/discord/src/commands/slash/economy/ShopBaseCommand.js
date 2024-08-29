import { CommandBase, CommandOptions } from 'eris'
import { Command } from '../../../structures/util'

export default class ShopBaseCommand extends Command {
  constructor() {
    super({
      name: 'shop background',
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }],
      isBase: true,
      slash: new CommandBase()
        .setName('shop')
        .setDescription('The shop command that allows you to buy new things to customize your account.')
        .addOptions(
          new CommandOptions()
            .setType(1)
            .setName('profile')
            .setDescription('You can buy a new profile that is in my stock.'),
          // new CommandOptions()
          //   .setType(1)
          //   .setName('background')
          //   .setDescription('You can buy a new background that is in my stock.'),
        )
    })
  }
}