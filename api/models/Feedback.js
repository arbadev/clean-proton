'use strict'

import Model from 'proton-mongoose-model'

export default class Feedback extends Model {

  schema() {
    return {
      title: {
        type: String,
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
