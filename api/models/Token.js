'use strict'

import Model from 'proton-mongoose-model'
import hat from 'hat'

export default class Token extends Model {

  schema() {
    return {
      facebookId: String,
      value: String,
      scope: String,
    }
  }

  /**
  * @method
  * @description create a token document
  * @return the token value
  */
  static generate(facebookId) {
    const token = new this({
      facebookId,
      value: hat(),
      scope: '*',
    })
    return token.save()
  }

  static findOneByValue(value) {
    return this.findOne({ value })
  }

}
