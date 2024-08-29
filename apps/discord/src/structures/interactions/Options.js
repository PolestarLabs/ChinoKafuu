export class Options {
  constructor(data) {
    if (data?.label !== undefined) {
      this.label = data.label
    }
    if (data?.value !== undefined) {
      this.value = data.value
    }
    if (data?.description !== undefined) {
      this.description = data.description
    }
    if (data?.emoji !== undefined) {
      this.emoji = data.emoji
    }
  }

  setLabel(label) {
    this.label = label
    return this
  }

  setValue(value) {
    this.value = value
    return this
  }

  addDescription(description) {
    this.description = description
    return this
  }

  addEmoji(emoji) {
    this.emoji = emoji
    return this
  }

  get data() {
    const d = {}
    if (this?.label !== undefined) {
      d.label = this?.label
    }
    if (this?.value !== undefined) {
      d.value = this?.value
    }
    if (this?.description !== undefined) {
      d.description = this?.description
    }
    if (this?.emoji !== undefined) {
      d.emoji = this?.emoji
      if (this?.emoji?.id !== undefined) {
        d.emoji.id = this.emoji.id
      }
      if (this?.emoji?.name !== undefined) {
        d.emoji.name = this.emoji.name
      }
    }
    return d
  }
}
