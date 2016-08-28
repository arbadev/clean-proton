'use strict'

import Model from 'proton-mongoose-model'

export default class User extends Model {

  schema() {
    return {
      firstName: String,
      lastName: String,
      avatar: String,
      message: String,
      ageRange: {
        type: {
          min: String,
          max: String,
        },
      },
      status: {
        type: String,
        enum: ['on', 'off'],
        default: 'on',
      },
      gender: {
        type: String,
        enum: ['male', 'female', 'other'],
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
    const _id = Model.parseObjectId(id)
    return this.findOne({ _id }).populate('languages')
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
    return this.findOne(criteria).populate('languages')
  }

  /**
   *
   *
   */
  static updateOne(id, values) {
    const _id = Model.parseObjectId(id)
    return this.findOneAndUpdate({ _id }, values, { new: true }).populate('languages')
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
    proton.log.debug('Criteria to find users', criteria)
    return this.find(criteria).populate('languages')
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
      yield this._getAgeCriteria(query),
      { status: 'on', avatar: { $ne: null }, message: { $ne: null } }
    )
  }

  /**
   *
   *
   */
  static * _getExcludedUsersCriteria({ user }) {
    const userId = Model.parseObjectId(user._id)

    // Users excluded by dislike
    const likeCriteria = {
      $or: [
        { value: 'like', from: userId },
        {
          value: 'dislike',
          $or: [{ from: userId }, { to: userId }],
        },
      ],
    }
    const likes = yield Like.find(likeCriteria)
    const likeIds = likes.map(like => {
      const { from, to } = like
      return to === userId ? from : to
    })

    const idsExcluded = [userId].concat(likeIds)
    return { _id: { $nin: idsExcluded } }
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
    return gender && ['female', 'male'].includes(gender) ? { gender } : {}
  }

  /**
   *
   *
   */
  static _getAgeCriteria({ minAge, maxAge }) {
    return {}
  }
}
