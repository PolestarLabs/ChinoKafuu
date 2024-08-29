import os from 'os'
import { WebSocket } from 'ws'
export const APIProcess = () => {
  process.title = 'framework+@chinokafuu/discord'
  if (process.env.PRODUCTION === 'false') {
    const ws = new WebSocket('ws://127.0.0.1:24607', {
      headers: {
        projectName: '@chinokafuu/discord'
      }
    })

    ws.on('error', () => null)

    ws.on('open', () => {
      setInterval(() => {
        const memoryUsage = process.memoryUsage()
        const cpuUsage = os.cpus()
        let system = 0
        let user = 0
        let idle = 0
        let irq = 0
        let countCpu = 0

        for (const cpu of cpuUsage) {
          countCpu++
          system += cpu.times.sys
          user += cpu.times.user
          idle += cpu.times.idle
          irq += cpu.times.irq
        }
        const resourceUsage = process.resourceUsage()

        ws.send(JSON.stringify({
          t: 'process',
          d: {
            projectName: '@chinokafuu/discord',
            time: Date.now(),
            memoryUsage: {
              arrayBuffers: memoryUsage.arrayBuffers,
              external: memoryUsage.external,
              heapTotal: memoryUsage.heapTotal,
              heapUsed: memoryUsage.heapUsed,
              rss: memoryUsage.rss
            },
            cpuUsage: {
              system: system,
              user: user,
              process: process.cpuUsage(),
              countCpu,
              idle,
              irq
            },
            resourceUsage: {
              fsRead: resourceUsage.fsRead,
              fsWrite: resourceUsage.fsWrite,
              ipcSent: resourceUsage.ipcSent,
              maxRss: resourceUsage.maxRSS,
              unsharedDataSize: resourceUsage.unsharedDataSize,
              unsharedStackSize: resourceUsage.unsharedStackSize
            }
          }
        }))
      }, 600)
    })
  }
}