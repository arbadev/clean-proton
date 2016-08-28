'use strict'

import Model from 'proton-mongoose-model'

const { ObjectId } = Model.adapter.Types
const populations = 'from to'

export default class Like extends Model {

  schema() {
    return {
      from: {
        type: Model.types.ObjectId,
        ref: 'User'
      },
      to: {
        type: Model.types.ObjectId,
        ref: 'User'
      },
      value: {
        type: String,
        enum: ['like', 'dislike'],
        required: true,
      },
      level: Number
    }
  }

  counterpart() {
    const { to, from, value, level } = this
    const criteria = { value, level, from: this.to, to: this.from }
    return this.model('Like').findOne(criteria)
  }

  isPositive() {
    return this.value == 'like'
  }

  * beforeCreate(record, next) {
    const criteria = { 'users._id': { '$all': [record.from, record.to] } }
    const spark = yield Spark.findOne(criteria)
    record.level = (spark) ? spark.level : 0
    next()
  }

  * afterCreate(record, next) {
    const criteria = { _id: record._id}
    // For the spark creation we need the from an the to values populated :D
    const like = yield this.model.findOne(criteria).populate(populations)
    // Get the counterpart of the like
    const counterpart = yield like.counterpart()

    if (like.isPositive() && counterpart) {
      if (like.level == 0) {
        const users = [like.from, like.to]
        yield Spark.create({ users })
      }
      if (like.level > 0) {
        const criteria = { 'users._id': { '$all': [record.from, record.to] } }
        const spark = yield Spark.update(criteria, { '$inc': { level: 1} })
      }
    }

    next()

  }

}
