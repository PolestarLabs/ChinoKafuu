import mongoose from 'mongoose'
import { intervalsDefault } from '../default/intervalsDefault'
import { workDefault } from '../default/workDefault'
const Users = new mongoose.Schema({
  id: { type: String, index: { unique: true } },
  yens: { type: Number, default: 0, index: true },
  timeDaily: { type: Number, default: 0 },
  sugarcube: { type: Number, default: 0 },
  afk: { type: Boolean, default: false, index: true },
  afkReason: { type: String, default: null },
  blacklist: { type: Boolean, default: false, index: true },
  blacklistReason: { type: String, default: null },
  aboutme: { type: String, default: '' },
  profileColor: { type: String, default: '#6b8dff' },
  isMarry: { type: Boolean, default: false },
  marryWith: { type: String, default: '' },
  backgrounds: { type: Number, default: 0 }, // Flags
  profiles: { type: Number, default: 0 }, // Flags
  flags: { type: Number, default: 0 },
  rep: { type: Number, default: 0 },
  repTime: { type: Number, default: 0 },
  shipValue: { type: String, default: null },
  lastUpdates: {
    job: { type: Number, default: -1 }
  },
  background: { type: String, default: 'gochiusa_3' },
  sticker: { type: String, default: 'bjork_post' },
  profileType: { type: String, default: 'default' },
  backgroundList: { type: Array, default: ['gochiusa_3'] },
  profileList: { type: Array, default: ['default'] },
  stopNotify: { type: Boolean, default: false },
  economy: workDefault(),
  intervals: intervalsDefault()
})

export default mongoose.model('Users', Users)
