export const ProcessModel = (options = {}) => ({
  t: '',
  d: {
    time: Date.now(),
    projectName: '',
    memoryUsage: {
      arrayBuffers: 0,
      external: 0,
      heapTotal: 0,
      heapUsed: 0,
      rss: 0
    },
    cpuUsage: {
      system: 0,
      user: 0
    },
    resourceUsage: {
      fsRead: 0,
      fsWrite: 0,
      ipcSent: 0,
      maxRss: 0,
      unsharedDataSize: 0,
      unsharedStackSize: 0
    }
  },
  ...options
})