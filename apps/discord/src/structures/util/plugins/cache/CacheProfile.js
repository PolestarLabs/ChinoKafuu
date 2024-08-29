import { PluginExtend } from '../loaders/PluginExtend'

export class CacheProfile extends PluginExtend {
  constructor() {
    super({
      name: 'cache_profile',
      args: {},
      timeout: 50 * 1000
    })

  }

  start() {
    this.$addClassState({
      data: {
        $cacheStoreData: new Map(),
        $cacheStore: new Map(),
        check: (USER_ID, state, json) => {
          if (state.$cacheStoreData.get(USER_ID) === undefined) return true
          if (state.$cacheStore.get(USER_ID) === undefined) return true

          const a = JSON.stringify(json)
          if (state.$cacheStoreData.get(USER_ID) === a) return false

          return true
        },
        setCache: (USER_ID, state, json, buffer) => {
          if (process.env.WITHOUT_STORING_CACHE_OF_PROFILES === undefined) return
          if (process.env?.WITHOUT_STORING_CACHE_OF_PROFILES === 'true') {
            state.$cacheStoreData.set(USER_ID, JSON.stringify(json))
            state.$cacheStore.set(USER_ID, buffer)
            setTimeout(() => {
              if (state.$cacheStore.get(USER_ID) !== undefined) {
                state.$cacheStore.delete(USER_ID)
              }
              if (state.$cacheStoreData.get(USER_ID) !== undefined) {
                state.$cacheStoreData.delete(USER_ID)
              }
            }, 7 * 1000)
          }
        }
      }
    })
    this.ready()
  }
}
