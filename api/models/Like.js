'use strict'

import Model from 'proton-mongoose-model'

export default class Like extends Model {

  schema() {
    return {
      from: String,
      to: String,
      value: {
        type: String,
        enum: ['like', 'dislike'],
      },
    }
  }

  * afterCreate(record, next) {
    const criteria = {
      from: record.to,
      to: record.from,
      value: 'like',
    }
    const likeToMe = yield this.model.findOne(criteria)
    if (likeToMe) {
      const mates = [likeToMe.from, record.from]
      Spark.create({ mates })
    }
    next()
  }

  * create(values) {
    const like = new this(values)
    return like.save()
  }

}
