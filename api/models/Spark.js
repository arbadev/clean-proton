'use strict'

import Model from 'proton-mongoose-model'

const status = ['undefined']
const levelSchema = {
  one: { decision: Boolean },
  two: { decision: Boolean, message: String },
  three: { decision: Boolean },
}

export default class Spark extends Model {

  schema() {
    return {
      from: {
        user: { type: Model.types.ObjectId, required: true },
        levels: levelSchema,
      },
      to: {
        user: { type: Model.types.ObjectId, required: true },
        levels: levelSchema,
      },
      status: { type: String, enum: status, default: 'undefined' },
    }
  }

  static create(opts) {
    const spark = new this(opts)
    return spark.save()
  }

}
