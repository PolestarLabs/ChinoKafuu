String.prototype.isJSON = function() {
  let is = true
  try {
    JSON.parse(this.toString())
  } catch (err) {
    is = false
  }
  return is
}

String.prototype.toJSON = function () {
  try {
    return JSON.parse(this.toString())
  } catch (err) {
    return {}
  }
}