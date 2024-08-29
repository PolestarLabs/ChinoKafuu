import mongoose from 'mongoose'
const Guilds = new mongoose.Schema({
  id: { type: String, index: { unique: true } },
  prefix: { type: String, default: process.env.BOT_PREFIX },
  channelReport: { type: String, default: '' },
  reportModule: { type: Boolean, default: false },
  lang: { type: String, default: 'en-US' },
  punishChannel: { type: String, default: '' },
  punishModule: { type: Boolean, default: false },
  partner: { type: Boolean, default: false },
  animu: { type: Boolean, default: false },
  flags: { type: Number, default: 0 },
  animuChannel: { type: String, default: '' },
  blacklist: { type: Boolean, default: false },
  blacklistReason: { type: String, default: '' },
  allowedChannel: { type: Object, default: { roles: [], channels: [] } },
  antiflood: { type: Object, default: { enabled: false, messagesLimit: 5 } }
})

export default mongoose.model('Guilds', Guilds)
