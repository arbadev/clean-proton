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
      languages: {
        type: [ObjectId],
      },
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
    const _id = Model.parseObjectId(id)
    return this.findOne({ _id })
  }

  /**
   * @method findOneById
   * @description find a user for any of its unique identifiers
   */
  static findOneById(id) {
    const _id = Model.parseObjectId(id)
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
  static updateOne(id, opts) {
    const _id = Model.parseObjectId(id)
    return this.findOneAndUpdate({ _id }, opts, { new: true })
  }

  /**
   *
   *
   */
  static destroy(id) {
    const _id = Model.parseObjectId(id)
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
    const criteria = yield this._buildCriteriaByQueryParams(query)
    proton.log.debug('criteria to find users', criteria)
    return this.find(criteria)
  }

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // Private methods
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------

  /**
   *
   *
   */
  static * _buildCriteriaByQueryParams(query) {
    return Object.assign(
      {},
      yield this._getExcludedUsersCriteria(query),
      yield this._getOrderCriteria(query),
      yield this._getGenderCriteria(query),
      yield this._getAgeCriteria(query)
    )
  }

  /**
   *
   *
   */
  static * _getExcludedUsersCriteria({ user }) {
    const userId = Model.parseObjectId(user._id)

    // Users excluded by dislike
    const dislikeCriteria = {
      value: 'dislike',
      $or: [{ from: userId }, { to: userId }],
    }
    const dislikes = yield Like.find(dislikeCriteria)
    const dislikeIds = dislikes.map(({ from, to }) => {
      return to === userId ? from : to
    })

    // Users excluded by existing spark
    const sparkCriteria = {
      'mates.user': userId,
    }
    const sparks = yield Spark.find(sparkCriteria)
    const sparkIds = sparks.map(spark => {
      const [from, to] = spark.mates
      return to.user === userId ? from.user : to.user
    })

    return { _id: { $ne: [userId].concat(sparkIds, dislikeIds) } }
  }

  /**
   *
   *
   */
  static _getOrderCriteria(query) {
    return {}
  }

  /**
   *
   *
   */
  static _getGenderCriteria({ gender }) {
    return gender ? { gender } : {}
  }

  /**
   *
   *
   */
  static _getAgeCriteria({ age }) {
    return {}
  }
}
