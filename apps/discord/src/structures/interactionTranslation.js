const localeAvailable = {
  'de-DE': {
    discordLocale: 'de',
    locale: 'de-DE',
  },
  'en-US': {
    discordLocale: 'en-US',
    locale: 'en-US'
  },
  'es-ES': {
    discordLocale: 'es-ES',
    locale: 'es-ES',
  },
  'en-GB': {
    discordLocale: 'en-GB',
    locale: 'en-US',
  },
  'fr-FR': {
    discordLocale: 'fr',
    locale: 'fr-FR',
  },
  'ja-JP': {
    discordLocale: 'ja',
    locale: 'ja-JP',
  },
  'ko-KR': {
    discordLocale: 'ko',
    locale: 'ko-KR'
  },
  'nl-NL': {
    discordLocale: 'nl',
    locale: 'nl-NL'
  },
  'pt-BR': {
    discordLocale: 'pt-BR',
    locale: 'pt-BR'
  },
  'ru-RU': {
    discordLocale: 'ru',
    locale: 'ru-RU'
  },
  'vi-VN': {
    discordLocale: 'vi',
    locale: 'vi-VN'
  },
  'zh-TW': {
    discordLocale: 'zh-TW',
    locale: 'zh-TW'
  }
}
const locales = [
  'id',
  'da',
  'de',
  'en-GB',
  'en-US',
  'es-ES',
  'fr',
  'hr',
  'it',
  'lt',
  'hu',
  'nl',
  'no',
  'pl',
  'pt-BR',
  'ro',
  'fi',
  'sv-SE',
  'vi',
  'tr',
  'cs',
  'el',
  'bg',
  'ru'
]

const getLocaleKeys = () => {
  return Object.entries(localeAvailable)
}

const getLocale = (key, client) => {
  const getLocale = (lang) => (client.i18nRegistry.getT(lang))(`slashcommand:${key}`)
  const keys = getLocaleKeys().map(([key, value]) => ({
    [value.discordLocale]: getLocale(key)
  }))
  return Object.assign({}, ...keys)
}

export const addLocaleInCommands = async (commands = [], client) => {
  for (const command of commands) {
    await addLocaleInCommand(client, command)
  }
}

export const addLocaleInCommand = async (client, command = { name: '', description: '' }) => {

  if (command.name !== undefined) {
    Object.assign(command, {
      name_localizations: getLocale(`${command.name}.name`, client)
    })
  }

  if (command.description !== undefined) {
    Object.assign(command, {
      description_localizations: getLocale(`${command.name}.description`, client)
    })
  }

  if (command.options !== undefined && Array.isArray(command.options)) {
    await command.options.map(async (i, index) => {
      if (command.name !== undefined) {
        Object.assign(i, {
          name_localizations: getLocale(`${command.name}.option${index}.name`, client)
        })
      }

      if (command.description !== undefined) {
        Object.assign(i, {
          description_localizations: getLocale(`${command.name}.option${index}.description`, client)
        })
      }

      if (command.choices !== undefined && Array.isArray(command.choices)) {
        await i.choices.map((choice, indexChoice) => {
          if (choice.name !== undefined) {
            Object.assign(choice, {
              name_localizations: getLocale(`${command.name}.option${index}.choices.choice${indexChoice}.name`, client)
            })
          }
        })
      }

      return i
    })
  }
}