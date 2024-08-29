import { ColorResolver } from './ColorResolver'

export class EmbedBuilder {
  constructor() {
    this.fields = []
    this.author = null
    this.description = null
    this.color = null
    this.file = null
    this.footer = null
    this.image = null
    this.timestamp = null
    this.title = null
    this.thumbnail = null
    this.url = null
  }

  /**
     *
     * @param {string} name
     * @param {string} icon_url
     * @param {string} url
     * @returns {EmbedBuilder}
     */
  setAuthor(name, icon_url, url) {
    this.author = { name, icon_url, url }
    return this
  }

  /**
     *
     * @param title The title of this embed
     * @returns {EmbedBuilder}
     */
  setTitle(title) {
    this.title = title
    return this
  }

  /**
     *
     * @param desc The description of this embed
     * @returns {EmbedBuilder}
     */
  setDescription(desc) {
    this.description = desc.toString().substring(0, 2048)
    return this
  }

  /**
     *
     * @param name {string} The name of this field to be set
     * @param value {string} The value of this field to be set
     * @param inline {boolean | null} Whether this field is inline or not
     * @returns {EmbedBuilder}
     */
  addField(name, value, inline = false) {
    if (!name || this.fields.length >= 25) return this
    if (!value) return false
    this.fields.push({ name: name.toString().substring(0, 256), value: value.toString().substring(0, 1024), inline })
    return this
  }

  /**
     *
     * @param {boolean} inline
     * @returns {EmbedBuilder}
     */
  addBlankField(inline = false) {
    this.addField('\u200B', '\u200B', inline)
    return this
  }

  /**
     *
     * @param color {string} The color to be set
     * @returns {EmbedBuilder}
     */
  setColor(color) {
    this.color = ColorResolver.resolve(color)
    return this
  }

  /**
     *
     * @param image {string} The source of the image
     * @param height {number | null} The height of the image
     * @param width {number | null} The width of the image
     * @return EmbedBuilder
     */
  setImage(image, height = null, width = null) {
    this.image = {
      url: image
    }
    if (height) this.image.height = height
    if (width) this.image.width = width
    return this
  }

  /**
     *
     * @param {number} timestamp TheISO8601 timestamp
     * @returns {EmbedBuilder}
     */
  setTimestamp(timestamp = new Date()) {
    this.timestamp = timestamp
    return this
  }

  /**
     *
     * @param {string} url
     * @return {EmbedBuilder}
     */
  setUrl(url) {
    this.url = url
    return this
  }

  setFooter(text, iconUrl) {
    this.footer = {
      text: text.toString().substring(0, 2048),
      icon_url: iconUrl
    }
    return this
  }

  /**
     *
     * @param {string} url The source of the thumbnail
     * @return {EmbedBuilder}
     */
  setThumbnail(url) {
    this.thumbnail = { url }
    return this
  }

  /**
     *
     * @param {string} content
     */
  build(content) {
    if (!content) content = ''
    return { content, embeds: [this] }
  }
}
