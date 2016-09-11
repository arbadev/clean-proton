  'use strict'

import Model from 'proton-mongoose-model'

const statuses = ['sparking', 'sparked,', 'sparkout']

const user = {
  _id: { type: Model.types.ObjectId },
  firstName: String,
  lastName: String,
  avatar: String,
  question: String,
  answer: String,
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
   * @method addQuestion
   * @description Add a question to the appropriate user in the spark
   * @param id - The id of the spark
   * @param from - who send the question
   * @param message - the voice note uri
   * @author Luis Hernandez
   */
  static * addQuestion(id, from, message) {
    const criteria = {
      _id: Model.parseObjectId(id),
      'users._id': Model.parseObjectId(from)
    }
    const values = { '$set': {'users.$.question': message } }
    const spark = yield this.findOneAndUpdate(criteria, values, { new: true })
    return spark
  }

 /**
  * @method addAnswer
  * @description Add an answer to the appropriate user in the spark
  * @param id - The id of the spark
  * @param from - who send the answer
  * @param message - the voice note uri
  * @author Luis Hernandez
  */
  static * addAnswer(id, from, message) {
    const criteria = {
      _id: Model.parseObjectId(id),
      'users._id': Model.parseObjectId(from)
    }
    const values = { '$set': {'users.$.answer': message } }
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
