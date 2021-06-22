import i18 from 'i18next'
import Fetch from 'i18next-fetch-backend'

export class Translator {

  async init(lang?: string): Promise<any> {
    const options = {
      fallbackLng: "de",
      lng: lang,
      debug: false,
      backend: {
        loadPath: '/static/i18n/{{lng}}.json',
      }
    }
    return i18.use(Fetch).init(options, (err, t) => {
      if (err) {
        throw (err)
      }
    })
  }

  async lang(code: string): Promise<any> {
    return i18.changeLanguage(code)
  }
  t(token: string): string {
    return i18.t(token)
  }
}

export const trl = token => i18.t(token)
