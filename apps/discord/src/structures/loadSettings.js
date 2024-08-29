import packageJson from '../../package.json' assert { type: 'json' }

export default function loadSettings() {
  return packageJson
}