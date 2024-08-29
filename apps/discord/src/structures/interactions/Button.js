export class Button {
  constructor() {
    this.type = 2
    this.emoji = null
    this.label = null
    this.style = 0
    this.disabled = false
    this.url = ''
    this.custom_id = null
  }
  /**
   *
   * @param {*} emoji
   * @returns
   *
   * ## Examples

  * { name: 'shyyRave', id: '942370920956321812', animated: true | false  }
      * *  Credits: **https://discord.com/developers/docs/interactions/message-components#buttons-button-styles**
      *
    *
    *
    */

  setEmoji(emoji) {
    this.emoji = emoji ?? null
    return this
  }

  setLabel(label) {
    this.label = label
    return this
  }

  customID(id) {
    this.custom_id = id
    return this
  }

  setURL(url) {
    this.url = url
    return this
  }

  setStatus(status) {
    this.disabled = status
    return this
  }

	/**
     *
     * @param {*} id
     * @returns
     *
     * ## Examples

    *| Name      | Value | Color                    | Required Field |
    *| --------- | ----- | ------------------------ | -------------- |
    *| Primary   | 1     | blurple                  | `custom_id`    |
    *| Secondary | 2     | grey                     | `custom_id`    |
    *| Success   | 3     | green                    | `custom_id`    |
    *| Danger    | 4     | red                      | `custom_id`    |
    *| Link      | 5     | grey, navigates to a URL | `url`          |
        * *  Credits: **https://discord.com/developers/docs/interactions/message-components#buttons-button-styles**
        *
     *
     *
     */
  setStyle(id) {
    this.style = id
    return this
  }

  build() {
    return this
  }

  data() {
    const a = {}
    a.type = 2
    if (typeof this.emoji === 'string') {
      a.emoji = this.emoji
    }

    if (typeof this.id === 'string') {
      a.custom_id = this.id
    }

    if (typeof this.label === 'string') {
      a.label = this.label
    }

    if (typeof this.style === 'number') {
      a.style = this.style
    }

    if (typeof this.disabled === 'boolean') {
      a.disabled = this.disabled
    }

    if (typeof this.url === 'string') {
      a.url = this.url
    }

    return a
  }
}
