'use strict'

import Model from 'proton-mongoose-model'

const populations = 'from to'

export default class Like extends Model {

  schema() {
    return {
      from: {
        type: Model.types.ObjectId,
        ref: 'User',
      },
      to: {
        type: Model.types.ObjectId,
        ref: 'User',
      },
      value: {
        type: String,
        enum: ['like', 'dislike'],
        required: true,
      },
      level: Number,
    }
  }

  counterpart() {
    const { level } = this
    const criteria = { level, from: this.to, to: this.from }
    return this.model('Like').findOne(criteria)
  }

  isPositive() {
    return this.value === 'like'
  }

  isNegative() {
    return this.value === 'dislike'
  }

  * beforeCreate(like, next) {
    const criteria = { 'users._id': { $all: [like.from, like.to] } }
    const spark = yield Spark.findOne(criteria)
    like.level = spark ? spark.level : 0
    next()
  }

  * afterCreate(like, next) {
    // The like of the counterpart
    const counterpart = yield like.counterpart()

    const sparkCriteria = { 'users._id': { $all: [like.from, like.to] } }

    if (counterpart && like.isPositive() && counterpart.isPositive()) {

      if (like.level === 0) {
        // For the spark creation we need the from an the to values populated :D
        like = yield this.model.findOne({ _id: like._id }).populate(populations)
        const users = [like.from, like.to]
        yield Spark.create({ users })
      }

      if (like.level > 0) {
        yield Spark.update(sparkCriteria, { $inc: { level: 1 } })
      }

    }

    if (like.isNegative() && counterpart) {
      yield Spark.update(sparkCriteria, { status: 'sparkout' })
    }

    next()
  }

}