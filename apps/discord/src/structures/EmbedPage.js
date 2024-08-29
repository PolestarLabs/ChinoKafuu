import EventEmitter from 'events'
import { EmbedBuilder } from './util'

export class EmbedPage extends EventEmitter {
  constructor(
    time = 50 * 1000,
    options = { users: [], waitMessage: false },
    ctx
  ) {
    super()
    this.ctx = ctx
    this.page = -1
    this.componentsEmbed = []
    this.options = options ?? { users: [], waitMessage: false }

    if (!options.waitMessage) {
      this.setListenerEmbed()
    }
    this.interactionBase = null
    this.id = options.id ?? null
    this.closed = false
    this.components = []
    this.timeout = null
    this.time = time ?? 50 * 10000

    this.#setTimeout()
    this.#setButton()
  }

  get #getComponents() {
    const components = this.components
    return this.componentsEmbed.length >= 2 ? [
      {
        type: 1,
        components: this.#setButton()
      },
      ...components
    ] : []
  }

  #addID(str) {
    const getID = typeof this.id === 'string' ? `${this.id}:` : ''

    return getID + str
  }

  get maxPage() {
    return this.componentsEmbed.length - 1
  }

  setListenerEmbed() {
    this.on('nextPage', (ctx) => {
      this.page++
      const component = this.componentsEmbed[Math.min(this.maxPage, this.page)]
      this.emit('page', (component === undefined ? [this.#defaultEmbed()] : [component]), ctx)
    })

    this.on('backPage', (ctx) => {
      this.page = Math.max(0, this.page - 1)
      const component = this.componentsEmbed[Math.min(this.maxPage, this.page)]

      this.emit('page', component === undefined ? [this.#defaultEmbed()] : [component], ctx)
    })

    this.on('page', async (component, ctx) => {
      ctx.editMessageInteraction({
        embeds: component,
        components: this.#getComponents,
      })
    })

    this.on('interaction', async ({ interaction, ctx }) => {
      if (interaction.data.custom_id === this.#addID('embedPage:nextPage')) {
        this.emit('nextPage', (ctx))
      } else if (interaction.data.custom_id === this.#addID('embedPage:backPage')) {
        this.emit('backPage', (ctx))
      }
    })

  }

  prepareToSend() {
    this.page = 0
    const component = this.componentsEmbed[Math.max(0, this.page)]

    return {
      components: this.#getComponents,
      embeds: [component === undefined ? this.#defaultEmbed() : component]
    }
  }

  setDefaultMessage(message) {
    if (this.componentsEmbed.length <= 0) return
    this.interactionBase = this.ctx.client.interactionManager.createInteractionBase(message.id, 2, {
      users: [this.ctx.message.member.id],
      expireUntil: this.time,
      isEmbedPage: true,
      embedPage: this
    })
    this.setListenerEmbed()
  }

  addComponents(...args) {
    this.componentsEmbed.push(...args)
  }

  #setButton() {
    const data = [{
      type: 2,
      style: 3,
      label: this.ctx._locale('basic:page.backPage'),
      custom_id: this.#addID(`embedPage:backPage`),
      disabled: this.page - 1 <= -1
    },
    {
      type: 2,
      style: 3,
      label: this.ctx._locale('basic:page.nextPage'),
      custom_id: this.#addID(`embedPage:nextPage`),
      disabled: this.page >= this.maxPage
    }]
    return this.componentsEmbed.length >= 2 ? data : []
  }

  #defaultEmbed() {
    return new EmbedBuilder()
      .setTitle('EmbedPage - Component')
      .setColor('DEFAULT')
      .setDescription('Error 404 —— Embed not found')
  }

  #setTimeout() {
    if (this.time !== null) {
      this.timeout = setTimeout(() => {
        this.#destroy()
      }, this.time)
    }
  }

  #clearTimeout() {
    clearTimeout(this.timeout)
  }

  #destroy() {
    this.closed = true
    this.emit('destroy', this.closed)
    this.removeAllListeners()
    this.#clearTimeout()
    this.components.slice(0, this.components.length)
    this.componentsEmbed.slice(0, this.componentsEmbed.length)
  }
}