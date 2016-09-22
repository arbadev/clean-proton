'use strict'

import Model from 'proton-mongoose-model'

const statuses = ['sparking', 'sparked,', 'sparkout']
const populations = 'users.languages'

const UserSchema = {
  _id: { type: Model.types.ObjectId },
  firstName: String,
  lastName: String,
  avatar: String,
  question: String,
  answer: String,
  birthdate: {
    type: Date,
  },
  gender: {
    type: String,
  },
  languages: [{
    type: Model.types.ObjectId,
    ref: 'Language',
  }],
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
      event: 'new sparkd',
      data: { sparkd: record.id },
    }
    const { NotificationService } = proton.app.services
    yield NotificationService.sendPush(record.users[0]._id, pushMessage)
    yield NotificationService.sendPush(record.users[1]._id, pushMessage)
    next()
  }

  /**
   * @method addQuestion
   * @description Add a question to the appropriate user in the sparkd
   * @param id - The id of the sparkd
   * @param from - who send the question
   * @param message - the voice note uri
   * @author Luis Hernandez
   */
  static * addQuestion(id, from, message) {
    const criteria = {
      _id: Model.parseObjectId(id),
      'users._id': from._id,
    }
    const values = { $set: { 'users.$.question': message } }
    const sparkd = yield this.findOneAndUpdate(criteria, values, { new: true })
      .populate(populations)
    return toJson.call(this, from, sparkd)
  }

  /**
   * @method addAnswer
   * @description Add an answer to the appropriate user in the sparkd
   * @param id - The id of the sparkd
   * @param from - who send the answer
   * @param message - the voice note uri
   * @author Luis Hernandez
   */
  static * addAnswer(id, from, message) {
    const criteria = {
      _id: Model.parseObjectId(id),
      'users._id': from._id,
    }
    const values = { $set: { 'users.$.answer': message } }
    const sparkd = yield this.findOneAndUpdate(criteria, values, { new: true })
      .populate(populations)
    return toJson.call(this, from, sparkd)
  }

  /**
   * @method findByQueryParams
   * @description
   * @param opts.user - The user that send request
   * @param opts.uri - the base uri of request
   * @param opts.params - the query params os request
   * @author Carlos Marcano
   */
  static * findByQueryParams({ user, uri, params }) {
    const { SearchService } = proton.app.services
    const criteria = buildCriteria.call(this, user, params)
    const opts = { criteria, uri, params, populations }
    const { pagination, collection } = yield SearchService.search(this, opts)
    const sparkds = collection.map(c => toJson.call(this, user, c))
    return { pagination, sparkds }
  }

  /**
   * @method findOne
   * @description
   * @param opts.user - The user that send request
   * @param opts.sparkd - The id of sparkd to find
   * @author Carlos Marcano
   */
  static * findOneByUser({ user, sparkdId }) {
    const criteria = {
      _id: Model.parseObjectId(sparkdId),
      'users._id': user._id,
    }
    const sparkd = yield this.findOne(criteria).populate(populations)
    return sparkd ? toJson(user, sparkd) : undefined
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

function toJson(user, sparkd) {
  const { CloudinaryService } = proton.app.services
  const { _id, status, level } = sparkd
  let me = {}
  let counterPart = {}
  sparkd.users.map(u => {
    if (u._id.equals(user._id)) me = u
    else counterPart = u
    return u
  })
  if (level === 1) {
    counterPart.avatar = CloudinaryService.pixelateUrlOfLevel2(counterPart.avatar)
  }
  const questionPending = !me.question
  const answerPending = !!counterPart.question
  return {
    _id,
    me,
    status,
    level,
    questionPending,
    answerPending,
    user: counterPart }
}
