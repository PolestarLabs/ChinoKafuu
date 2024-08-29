export class CacheManager {
  constructor(client) {
    this.client = client
    this.timeFunction = null
    this.time = 5 * 1000 // 5 seconds
    this.config = {
      accountTime: 7680000000, // 12 Days
      messageTime: 640000000, // 1 Day
      users: {
        time: 160000000, // for accounts that are not new ~> 6 Hours
        newAccount: 6000000 // For new account ~> 60 Minutes
      },
      guilds: {
        members: {
          time: 6000000, // 1 Hour
          newAccount: 60000 // 1 Minute
        },
        message: 640000000 // 1 Day
      }
    }
  }

  start() {
    if (this.timeFunction === null) {
      this.timeFunction = setInterval(() => {
        this.client.users.map(user => {
          if (!user.bot) {
            if (user.cacheTime !== undefined) {
              if (user.cacheTime - Date.now() < 0) {
                this.client.users.remove(user)
              }
            } else {
              if ((user.createdAt - Date.now() + this.config.accountTime < 0)) {
                user.cacheTime = Date.now() + this.config.users.time
              } else {
                user.cacheTime = Date.now() + this.config.users.newAccount
              }
            }
          }
        })
        this.client.guilds.map(guild => {
          if (guild !== undefined) {
            guild.members.map(member => {
              if (!member.user.bot) {
                if (member.cacheTime !== undefined) {
                  if (member.cacheTime - Date.now() < 0) {
                    guild.members.remove(member)
                  }
                } else {
                  if (member.user.createdAt - Date.now() + this.config.accountTime < 0) {
                    member.cacheTime = Date.now() + this.config.guilds.members.time
                  } else {
                    member.cacheTime = Date.now() + this.config.guilds.members.newAccount
                  }
                }
              }
            })
            guild.channels.map(channel => {
              if (channel.messages !== undefined) {
                if (!(channel.messages.size === 0)) {
                  channel.messages.map(message => {
                    if (message.cacheTime !== undefined) {
                      if (message.cacheTime - Date.now() < 0) {
                        channel.messages.remove(message)
                      }
                    } else {
                      message.cacheTime = Date.now() + this.config.messageTime
                    }
                  })
                }
              }
            })
          }
        })

      }, this.time)
    }
  }

  end() {
    if (this.timeFunction !== null) {
      clearInterval(this.timeFunction)
    }
    this.timeFunction = null
    return this
  }
}
