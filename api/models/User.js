'use strict'

import Model from 'proton-mongoose-model'

const { ObjectId } = Model.types

export default class User extends Model {

  schema() {
    return {
      firstName: String,
      lastName: String,
      avatar: String,
      message: String,
      email: { type: String, unique: true },
      facebookId: { type: String, unique: true },
      coordinates: { type: [Number], index: '2d' } // [longitude, latitude]
    }
  }

  /**
   * @method findOneById
   * @description find a user for any of its unique identifiers
   */
  static findOneById(id) {
    const { Util } = proton.app.services
    const _id = Util.getObjectId(id)
    const criteria = {
      $or: [
        { _id },
        { email: id },
        { facebookId: id }
      ]
    }
    return this.findOne(criteria)
  }

  static updateOne(id, opts) {
    const { Util } = proton.app.services
    const _id = Util.getObjectId(id)
    return this.findOneAndUpdate(_id, opts, { new:true })
  }

  /**
   *
   *
   */
  static destroy(id) {
    const { Util } = proton.app.services
    const _id = Util.getObjectId(id)
    const criteria = {
      $or: [
        { _id },
        { email: id },
        { facebookId: id }
      ]
    }
    return this.findOneAndRemove(criteria)
  }

}
