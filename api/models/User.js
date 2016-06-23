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
      age: Number,
      status: {
        type: String,
        enum: ['on', 'off'],
        default: 'on',
      },
      gender: {
        type: String,
        enum: ['woman', 'man'],
      },
      email: {
        type: String,
        unique: true,
      },
      facebookId: {
        type: String,
        unique: true,
      },
      coordinates: {
        type: [Number],
        index: '2d',
      },
      languages: [{
        type: Model.types.ObjectId,
        ref: 'Language',
      }],
      preferences: {
        type: Model.types.Mixed,
      },
    }
  }

  /**
   *
   *
   */
  static me(id) {
    const { Util } = proton.app.services
    const _id = Util.getObjectId(id)
    return this.findOne({ _id }).populate('languages')
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
        { facebookId: id },
      ],
    }
    return this.findOne(criteria)
  }

  /**
   *
   *
   */
  static updateOne(id, values) {
    const { Util } = proton.app.services
    const _id = Util.getObjectId(id)
    return this.update({ _id }, values, { new: true })
      .then(([user]) => this.me(user._id))
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
        { facebookId: id },
      ],
    }
    return this.findOneAndRemove(criteria)
  }

  /**
  *
  *
  */
  static * findByQueryParams(query) {
    const { sparkiesOf, sparkStatus, addNervay } = query
    if (sparkiesOf) {
      const id = ObjectId.isValid(sparkiesOf) ? new ObjectId(sparkiesOf) : null
      const criteria = {
        status: sparkStatus,
        $or: [
          { from: { user: id } },
          { to: { user: id } },
        ],
      }
      const sparkies = yield Spark.find(criteria)
    }
    return this.findOneAndRemove()
  }

}
