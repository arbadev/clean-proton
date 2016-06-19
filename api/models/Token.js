'use strict'

import Model from 'proton-mongoose-model'
import hat from 'hat'

export default class Token extends Model {

  schema() {
    return {
      user: String,
      value: String,
      scope: String,
    }
  }

  /**
  * @method
  * @description create a token document
  * @return the token value
  */
  static generate(user) {
    const token = new this({
      user,
      value: hat(),
      scope: '*',
    })
    return token.save()
  }

  static findOneByValue(value) {
    return this.findOne({ value })
  }

}
