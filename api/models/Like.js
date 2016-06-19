'use strict'

import Model from 'proton-mongoose-model'

const { ObjectId } = Model.adapter.Types

export default class Like extends Model {

  schema() {
    return {
      from: String,
      to: String,
      value: {
        type: String,
        enum: ['like', 'dislike'],
        required: true,
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
      const mates = [{ user: likeToMe.from }, { user: record.from }]
      yield Spark.create({ mates })
    }
    next()
  }

  static * create(values) {
    proton.log.debug('new like', values)
    const like = new this(values)
    return like.save()
  }

}
