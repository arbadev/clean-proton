'use strict'

import Model from 'proton-mongoose-model'

const statuses = ['sparking', 'sparked,', 'sparkout']

const UserSchema = {
  _id: { type: Model.types.ObjectId },
  firstName: String,
  lastName: String,
  avatar: String,
  message: String,
  age: String,
}

export default class Sparkd extends Model {

  schema() {
    return {
      users: [UserSchema],
      status: {
        type: String,
        enum: statuses,
        default: 'sparking',
      },
      level: {
        type: Number,
        default: 1,
        min: 1,
        max: 3,
      },
    }
  }

  * afterCreate(record, next) {
    const pushMessage = {
      event: 'new spark',
      data: { spark: record.id },
    }
    const { NotificationService } = proton.app.services
    yield NotificationService.sendPush(record.users[0]._id, pushMessage)
    yield NotificationService.sendPush(record.users[1]._id, pushMessage)
    next()
  }

  /**
   * @method addMessage
   * @description Add a voice message to an spark
   * @param id - The id of the spark
   * @param from - who send the message
   * @param message - the message uri
   * @author Luis Hernandez
   */
  static * addMessage(id, from, message) {
    const criteria = {
      _id: Model.parseObjectId(id),
      'users._id': Model.parseObjectId(from),
    }
    const values = { $set: { 'users.$.message': message } }
    const spark = yield this.findOneAndUpdate(criteria, values, { new: true })
    return spark
  }

  static * findByQueryParams({ user, uri, params }) {
    const { SearchService } = proton.app.services
    const criteria = buildCriteria.call(this, user, params)
    const opts = { criteria, uri, params }
    const { pagination, collection } = yield SearchService.search(this, opts)
    const sparkds = collection.map(c => formatSparkd.call(this, user, c))
    return { pagination, sparkds }
  }
}

function buildCriteria(user, params) {
  const { level, status } = params
  const criteria = {
    'users._id': Model.parseObjectId(user._id),
  }
  if (level) criteria.level = Number(level)
  if (status) criteria.status = status
  return criteria
}

function formatSparkd(user, sparkd) {
  const { CloudinaryService } = proton.app.services
  const { _id, status, level } = sparkd
  const counterPart = sparkd.users.find(({ _id }) => !_id.equals(user._id))
  if (level === 1) {
    counterPart.avatar = CloudinaryService.pixelateUrlOfLevel2(user.avatar)
  }
  return { _id, status, level, user: counterPart }
}
