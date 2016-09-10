'use strict'

import Model from 'proton-mongoose-model'
import _ from 'lodash'

export default class User extends Model {

  schema() {
    return {
      firstName: String,
      lastName: String,
      avatar: String,
      message: String,
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
  static * me(criteria) {
    const me = yield this.findOne(criteria).populate('languages')
    if (!me) return undefined
    const { CloudinaryService } = proton.app.services
    const publicAvatar = CloudinaryService.pixelateUrlOfLevel1(me.avatar)
    const transform = (doc, ret) => ret.avatar ? Object.assign(ret, { publicAvatar }) : ret.avatar
    return me.toJSON({ transform })
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
    const { CloudinaryService } = proton.app.services
    if (!this.schema.options.toJSON) this.schema.options.toJSON = {}
    this.schema.options.toJSON.transform = (doc, ret) => {
      ret.avatar = CloudinaryService.pixelateUrlOfLevel1(ret.avatar)
      return _.pick(ret, '_id', 'firstName', 'lastName', 'avatar', 'message', 'status', 'birthdate')
    }
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
