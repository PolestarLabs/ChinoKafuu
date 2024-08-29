
import('node:zlib')

Error.prototype.debug = function (details, log) {
  const myPackage = {
    version: process.version
  }

  const a = this.stack
    .removePath()
    .split('\n')
  a.push('')
  a.push('')
  if (process.env.PRODUCTION !== undefined) {
    if (process.env.PRODUCTION !== undefined) {
      let type = 'unknown'
      switch (process.env.PRODUCTION) {
        case 'false': {
          type = `stable-${myPackage.version}`
          break
        }
        case 'true': {
          type = `beta-${myPackage.version}`
          break
        }
        default:
          type = `productionUnknown-${myPackage.version} -> (${process.env.PRODUCTION})`
      }
      a.push(`Production: ${type}`)
    }

    if (process.env.PRODUCTION === 'true') {
      if (process.platform !== undefined) {
        a.push(`Platform: ${process.platform}`)
      } else {
        a.push(`Platform: unknown`)
      }
      if (process.arch !== undefined) {
        a.push(`Arch: ${process.arch}`)
      } else {
        a.push(`Arch: unknown`)
      }
      if (process.versions.node !== undefined) {
        a.push(`Version: ${process.versions.node}`)
      } else {
        a.push(`Version: unknown`)
      }
      if (process.versions.v8 !== undefined) {
        a.push(`V8: ${process.versions.v8}`)
      } else {
        a.push(`V8: unknown`)
      }
      if (process.argv0 !== undefined) {
        a.push(`ArgV0: ${process.argv0}`)
      } else {
        a.push(`ArgV0: unknown`)
      }

      if (log !== undefined) {
        if (details !== undefined) {
          if (log) {
            try {
              a.push(`Details: ${JSON.stringify(details)}`)
            } catch (err) {
              a.push('Details:  -> Failed to parse JSON')
            }
          }
        } else {
          try {
            a.push(`Details: ${JSON.stringify(JSON.parse('{}'))}`)
          } catch (err) {
            a.push(`Details: owo What's is this?`)
          }
        }
      }
    }
  } else {
    a.push(`Production: envUnknown`)
  }
  return a.join('\n')
}
