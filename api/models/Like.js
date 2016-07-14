'use strict'

import Model from 'proton-mongoose-model'

export default class Like extends Model {

  schema() {
    return {
      from: { type: Model.types.ObjectId, required: true, ref: 'User' },
      to: { type: Model.types.ObjectId, required: true, ref: 'User' },
      value: {
        type: String,
        enum: ['like', 'dislike'],
        required: true,
      },
    }
  }

  * afterCreate(record, next) {
    const { from, to, value } = record
    proton.log.info(`A new like has been created
        form ${from} user,
        to ${to} user,
        and value ${value}`)
    if (value === 'like') {
      const likeToMeCriteria = {
        from: to,
        to: from,
        value: 'like',
      }
      const likeToMe = yield this.model.findOne(likeToMeCriteria)
      if (likeToMe) {
        const mates = [{ user: likeToMe.from }, { user: record.from }]
        yield Spark.create({ mates })
      }
    }
    next()
  }

  static * create(values) {
    const like = new this(values)
    return like.save()
  }

}
