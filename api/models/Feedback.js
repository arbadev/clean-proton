'use strict'

import Model from 'proton-mongoose-model'

export default class Feedback extends Model {

  schema() {
    return {
      reason: {
        type: String,
        enum: ['AAAAA', 'BBBBB'],
      },
      description: String,
      from: {
        type: Model.types.ObjectId,
        ref: 'User',
        required: true,
      },
    }
  }

}
