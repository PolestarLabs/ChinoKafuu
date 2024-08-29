import { Choice, CommandBase, CommandOptions } from 'eris'
import { Command } from '../../../structures/util'

export default class ConfigCommand extends Command {
  constructor() {
    super({
      name: 'config',
      aliases: ['module', 'configurações', 'configurar'],
      permissions: [{
        entity: 'user',
        permissions: ['manageGuild']
      },
      {
        entity: 'bot',
        permissions: ['embedLinks']
      }],
      isBase: true,
      slash: new CommandBase()
        .setName('config')
        .setDescription('Enable and disable some modules who I have in your guild.')
        .addOptions(
          new CommandOptions()
            .setType(1)
            .setName('animu')
            .setDescription('Animu Radio')
            .addOptions(
              new CommandOptions()
                .setType(3)
                .setName('status')
                .setDescription('You need select o option set status of config.')
                .addChoices(
                  new Choice()
                    .setName('Enabled')
                    .setValue('enable'),
                  new Choice()
                    .setName('Disabled')
                    .setValue('disable'),
                )
                .isRequired(),
              new CommandOptions()
                .setType(3)
                .setAutocomplete()
                .setName('channel')
                .setDescription('You need select o channel set config.')
                .isRequired(),
            ),
          new CommandOptions()
            .setType(1)
            .setName('mod')
            .setDescription('Mod Log')
            .addOptions(
              new CommandOptions()
                .setType(3)
                .setName('status')
                .setDescription('You need select o option set status of config.')
                .addChoices(
                  new Choice()
                    .setName('Enabled')
                    .setValue('enable'),
                  new Choice()
                    .setName('Disabled')
                    .setValue('disable'),
                )
                .isRequired(),
              new CommandOptions()
                .setType(3)
                .setAutocomplete()
                .setName('channel')
                .setDescription('You need select o channel set config.'),
            ),
          new CommandOptions()
            .setType(1)
            .setName('report')
            .setDescription('Report Module')
            .addOptions(
              new CommandOptions()
                .setType(3)
                .setName('status')
                .setDescription('You need select o option set status of config.')
                .addChoices(
                  new Choice()
                    .setName('Enabled')
                    .setValue('enable'),
                  new Choice()
                    .setName('Disabled')
                    .setValue('disable'),
                )
                .isRequired(),
              new CommandOptions()
                .setType(3)
                .setAutocomplete()
                .setName('channel')
                .setDescription('You need select o channel set config.'),
            ),
        )
    })
  }
}
