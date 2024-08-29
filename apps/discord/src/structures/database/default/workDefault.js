export const workDefault = () => ({
  bank: { type: Number, default: 0 },
  value: { type: Number, default: 0 },
  work: {
    job: { type: Number, default: -1 },
    arrested: { type: Boolean, default: false },
  }
})