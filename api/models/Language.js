import Model from 'proton-mongoose-model'

export default class Language extends Model {

  schema() {
    return {
      name: String,
      code: { type: String, unique: true },
    }
  }

}
