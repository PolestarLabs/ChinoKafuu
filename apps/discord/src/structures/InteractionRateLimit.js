export class InteractionRateLimit {
  constructor() {
    this.users = []
  }

  checkUser(userID) {
    const getUser = this.getUser(userID)
    if (getUser === null) {
      this.addUser(userID, 100)
      return false
    }

    if ((getUser.timestamp - Date.now()) < 0) {
      getUser.attempt = 0
      getUser.timestamp = Date.now() + 5 * 1000
    } else {
      if (getUser.attempt + 1 >= 5) {
        getUser.seconds += getUser.seconds
        getUser.attempt = 0
        getUser.startsAt = Date.now()
        getUser.finishIn = Date.now() + getUser.seconds * 1000
        return true
      }
      getUser.attempt++
    }

    return true
  }

  removeUser(userID) {
    const index = this.users.findIndex((i) => i.userID === userID)
    if (index === -1) return this.users

    return this.users.splice(index, 1)
  }

  getUser(userID) {
    return this.users.find((i) => i.userID === userID) ?? null
  }

  addUser(user, seconds) {
    this.users.push({
      userID: user,
      seconds,
      startsAt: Date.now(),
      finishIn: Date.now() + seconds,
      timestamp: Date.now() + 2 * 1000,
      attempt: 0
    })
  }
}