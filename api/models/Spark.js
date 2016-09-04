  'use strict'

import Model from 'proton-mongoose-model'

const statuses = ['sparking', 'sparked,', 'sparkout']

const user = {
  _id: { type: Model.types.ObjectId },
  firstName: String,
  lastName: String,
  avatar: String,
  message: String,
  age: String,
}

export default class Spark extends Model {

  schema() {
    return {
      users: [user],
      status: {
        type: String,
        enum: statuses,
        default: 'sparking',
      },
      level: {
        type: Number,
        default: 1,
        min: 1,
        max: 3
      },
    }
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
      'users._id': Model.parseObjectId(from)
    }
    const values = { '$set': {'users.$.message': message } }
    const spark = yield this.findOneAndUpdate(criteria, values, { new: true })
    return spark
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

}
