import mongoose from 'mongoose'
const Commands = new mongoose.Schema({
  id: { type: String, index: { unique: true } },
  disable: { type: Boolean, default: false },
  reason: { type: String, default: '' }
})

export default mongoose.model('Commands', Commands)