import { Member, User } from 'eris'
import EventEmitter from 'events'
export class NightlyDeveloper extends EventEmitter {
  constructor() {
    super()
    // Add your tools to work with good functions.
    this.tools = new Map()
    // State
    this.$state = {}
    this.user = new Map()
    this.$disable = {}
  }

  addTool(name, func) {
    return this.tools.set(name, func)
  }

  addUser({ user, blocked, data }) {
    const UserData = class $UserData extends EventEmitter {
      constructor({ user, blocked, $data, type }) {
        super()
        this.user = user
        this.type = type
        this.blocked = blocked
        this.$data = $data
      }
    }
    if (user instanceof User) {
      const a = new UserData({ user: user, blocked: blocked, $data: data, type: 'user' })
      this.user.set(user.id, user)
      return a
    }
    if (user instanceof Member) {
      const a = new UserData({ user: user, blocked: blocked, $data: data, type: 'member' })
      this.user.set(user.id, a)
      return a
    }
    return null
  }

  delUser(user) {
    if (user instanceof User) {
      this.user.delete(user.id)
      return true
    }
    if (user instanceof Member) {
      this.user.delete(user.id)
      return true
    }
    if (user.id !== undefined) {
      this.user.delete(user.id)
      return true
    }
    return false
  }

}