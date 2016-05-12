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
      email: { type: String, unique: true },
      facebookId: { type: String, unique: true },
      avatar: String,
      message: String,
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
        { _id },
        { email: id },
        { facebookId: id },
      ],
    }
    return this.findOne(criteria)
  }

  static updateOne(id, opts) {
    const _id = ObjectId.isValid(id) ? new ObjectId(id) : null
    return this.findOneAndUpdate(_id, opts, { new: true })
  }

  /**
  *
  *
  */
  static destroy(id) {
    const _id = ObjectId.isValid(id) ? new ObjectId(id) : null
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
  static * findWithQuery(query) {
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
