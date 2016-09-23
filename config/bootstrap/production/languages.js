import languages from '../../../assets/languages.json'

export default () => {
  languages.forEach(lang => {
    const criteria = { code: lang.code }
    const opts = { upsert: true }
    Promise.resolve(Language.findOneAndUpdate(criteria, lang, opts))
  })
}
