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

  static * findByQueryParams(query) {
    const { CloudinaryService } = proton.app.services
    const userId = query.user._id
    const criteria = {
      'users._id': userId,
    }
    if (!this.schema.options.toJSON) this.schema.options.toJSON = {}
    this.schema.options.toJSON.transform = (doc, ret) => {
      const { status, level } = ret
      const user = ret.users.find(({ _id }) => _id && _id !== userId)
      if (level === 1) {
        user.avatar = CloudinaryService.pixelateUrlOfLevel2(user.avatar)
      }
      return { user, status, level }
    }
    return this.find(criteria)
  }

}
