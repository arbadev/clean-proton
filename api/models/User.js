'use strict'

import Model from 'proton-mongoose-model'
import moment from 'moment'

const limitDefault = 20
const genders = ['male', 'female', 'other']

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
        enum: genders,
      },
      birthdate: {
        type: Date,
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
        index: '2dsphere',
        default: [0, 0],
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
    const publicAvatar = me.avatar ? CloudinaryService.pixelateUrlOfLevel1(me.avatar) : undefined
    const transform = (doc, ret) => ret.avatar ? Object.assign(ret, { publicAvatar }) : ret.avatar
    return me.toJSON({ transform })
  }


  /**
   *
   *
   */
  static * updateMe(_id, values) {
    if (values.languages) {
      const languages = yield Language.find({ code: { $in: values.languages } })
      values.languages = languages.map(lang => lang._id)
    }
    yield this.findOneAndUpdate({ _id }, values)
    return this.me({ _id })
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
  static * findByQueryParams({ user, params = {} }) {
    const limit = params.limit || limitDefault
    let users = [...(yield findUsersLikesMe.call(this, user, limit))]
    if (limit > users.length) {
      const criteria = yield buildCriteria.call(this, user, params)
      const opts = {
        coordinates: user.coordinates,
        query: criteria,
        limit: limit - users.length,
      }
      users = [...users, ...(yield findNearbyUsers.call(this, opts))]
    }
    return users.map(u => toJson.call(this, u))
  }
}

/**
 * @description
 * @author Carlos Marcano
 */
function * findUsersLikesMe(user, limit) {
  let criteria = { level: 0, from: user._id }
  let likes = yield Like.find(criteria)
  const myLikeUsers = likes.map(({ to }) => to)
  criteria = { value: 'like', level: 0, to: user._id, from: { $nin: myLikeUsers } }
  likes = yield Like.find(criteria)
  const usersLikesMe = likes.map(({ from }) => from)
  const query = { _id: { $in: usersLikesMe } }
  const opts = {
    limit,
    query,
    coordinates: user.coordinates,
  }
  return findNearbyUsers.call(this, opts)
}

/**
 * @description
 * @author Carlos Marcano
 */
function * buildCriteria(user, params) {
  const userId = user._id
  const likesCriteria = { level: 0, $or: [{ from: userId }, { to: userId }] }
  const likes = yield Like.find(likesCriteria)

  const usersExcluded = likes.map(l => userId.equals(l.from) ? l.to : l.from)
  usersExcluded.push(userId)

  const criteria = {
    _id: { $nin: usersExcluded },
    status: 'on',
    avatar: { $ne: null },
    message: { $ne: null },
    gender: params.gender || { $in: genders },
  }

  if (params.minAge && params.maxAge) {
    const minDate = moment().subtratc(params.minAge, 'years')
    const maxDate = moment().subtratc(params.maxAge, 'years')
    criteria.birthdate = {
      $gt: maxDate.toDate(),
      $lt: minDate.toDate(),
    }
  }

  return criteria
}

/**
 * @description
 * @author Carlos Marcano
 */
function findNearbyUsers({ coordinates, query, limit }) {
  const $geoNear = {
    query,
    limit,
    near: { coordinates, type: 'Point' },
    spherical: true,
    distanceField: 'distance',
    uniqueDocs: true,
  }
  const $project = {
    _id: 1,
    firstName: 1,
    lastName: 1,
    message: 1,
    avatar: 1,
    status: 1,
    birthdate: 1,
    distance: 1,
  }
  return this.aggregate([{ $geoNear }, { $project }])
}

/**
 * @description
 * @author Carlos Marcano
 */
function toJson(user) {
  const json = user.toJSON ? user.toJSON() : user
  const { CloudinaryService } = proton.app.services
  json.avatar = CloudinaryService.pixelateUrlOfLevel1(json.avatar)
  return json
}
