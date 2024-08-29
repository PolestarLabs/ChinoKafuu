
export class SelectionMenu {
  constructor(data) {
    this.type = 3
    if (data?.custom_id !== undefined) {
      this.custom_id = data.custom_id
    }
    this.options = []
    if (data?.emoji !== undefined) {
      this.emoji = data?.emoji
    }
    if (data?.placeholder !== undefined) {
      this.placeholder = data.placeholder
    }
    if (data?.min_values !== undefined) {
      this.min_values = data.min_values
    }
    if (data?.max_values !== undefined) {
      this.max_values = data.max_values
    }
    if (data?.disabled !== undefined) {
      this.disabled = data.disabled
    }
  }

  setCustomID(id) {
    this.custom_id = id
    return this
  }

  addPlaceHolder(placeholder) {
    this.placeholder = placeholder
    return this
  }

  addItem(...items) {
    if (Array.isArray(items[0])) {
      for (const itemKey of items[0]) {
        this.options.push(itemKey.data)
      }
      return this
    }
    for (const item of items) {
      this.options.push(item.data)
    }
    return this
  }

  addEmoji(emoji) {
    this.emoji = emoji
    return this
  }

  minValues(value) {
    this.min_values = value
    return this
  }

  maxValues(value) {
    this.max_values = value
    return this
  }

  isDisable() {
    this.disabled = true
    return this
  }

  isEnable() {
    this.disabled = false
    return this
  }

  data() {
    const d = {
      type: 3
    }
    if (this?.custom_id !== undefined) {
      d.custom_id = this.custom_id
    }
    d.options = []
    if (this?.emoji !== undefined) {
      d.emoji = this?.emoji
      if (this?.emoji?.id !== undefined) {
        d.emoji.id = this.emoji.id
      }
      if (this?.emoji?.name !== undefined) {
        d.emoji.name = this.emoji.name
      }
    }
    if (this?.placeholder !== undefined) {
      d.placeholder = this.placeholder
    }
    if (this?.min_values !== undefined) {
      d.min_values = this.min_values
    }
    if (this?.max_values !== undefined) {
      d.max_values = this.max_values
    }
    if (this?.disabled !== undefined) {
      d.disabled = this.disabled
    }
    if (!(this.options.length === 0)) {
      d.options = this.options
    }
    return d
  }
}
