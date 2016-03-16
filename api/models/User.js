'use strict'

import Model from 'proton-mongoose-model'
import MongooseQuark from 'proton-quark-mongoose'

const mongoose = MongooseQuark.mongoose()
const ObjectId = mongoose.Types.ObjectId

export default class User extends Model {

  schema() {
    return {
      firstName: String,
      lastName: String,
      email: String,
      facebookId: String,
      avatar: String,
      message: String
    }
  }

  /**
   * @method findOneById
   * @description find a user for any of its unique identifiers
   */
  static findOneById(id) {
    const _id = ObjectId.isValid(id) ? new ObjectId(id) : null
    const criteria = {
      $or: [
        {_id},
        {email: id},
        {facebookId: id}
      ]
    }
    return this.findOne(criteria)
  }

  static update(id, opts) {
    const _id = ObjectId.isValid(id) ? new ObjectId(id) : null
    return this.update({_id}, opts)
  }

}
