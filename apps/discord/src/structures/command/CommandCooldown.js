export class CommandCooldown {
  constructor() {
    this.users = new Map()
  }

  addUser(id, time) {
    if (time === 0) {
      return
    }
    const users = this.users
    this.users.set(id, {
      userID: id,
      request: 0,
      requestLimit: 7,
      _commandCooldown: time,
      _timeDefault: 5,
      _try: 0,
      _warn: false,
      _stress: false,
      timeSet: time + Date.now(),
      timeout: setTimeout(() => {
        clearTimeout(users.get(id).timeout)
        users.delete(id)
      }, time),
      user_was_warned: false,
      user: null,
      locked: true,
      delete: () => {
        clearTimeout(this.users.get(id).timeout)
        return this.users.delete(users)
      }
    })
  }

  _addUserStress(id, time, limit, _try) {
    if (time === 0) {
      return
    }
    const users = this.users
    this.users.set(id, {
      userID: id,
      request: 0,
      requestLimit: 3,
      _commandCooldown: time,
      _timeDefault: 5,
      _warn: true,
      _stress: true,
      _try: _try,
      timeSet: time + Date.now(),
      timeout: setTimeout(() => {
        clearTimeout(users.get(id).timeout)
        users.delete(id)
      }, time),
      user_was_warned: false,
      user: null,
      locked: true,
      delete: () => {
        clearTimeout(this.users.get(id).timeout)
        return this.users.delete(users)
      }
    })
  }

  removeUser(id) {
    return this.users.get(id).delete()
  }
}