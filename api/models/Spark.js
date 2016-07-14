  'use strict'

  import Model from 'proton-mongoose-model'

  const statuses = ['one', 'two,', 'three', 'finishied']
  const levelSchema = {
    one: { decision: Boolean },
    two: { decision: Boolean, message: String },
    three: { decision: Boolean },
  }
  const mateSchema = {
    user: { type: Model.types.ObjectId, required: true, ref: 'User' },
    levels: levelSchema,
  }

  export default class Spark extends Model {

    schema() {
      return {
        mates: [mateSchema],
        status: {
          type: String,
          enum: statuses,
        },
      }
    }

    * afterCreate(record, next) {
      const [firstMate, secondMate] = record.mates
      proton.log.info(`A new spark has been created
        between ${firstMate.user} and ${secondMate.user}`)
      const pushMessage = { event: 'new spark', data: { spark: record.id } }
      const { NotificationService } = proton.app.services
      yield NotificationService.sendPush(firstMate.user, pushMessage)
      yield NotificationService.sendPush(secondMate.user, pushMessage)
      next()
    }

  /**
   * @description this method gets the params (from , to), and find if a Spark
   alredy exist with those users, if exist it will update the data with their
   answers, otherwise create a new spark with the undefined status waiting for
   the other User asnwer
   * @author Andres Barradas <andres@nucleos.io>
   */
    static * create(values) {
      const spark = new this(Object.assign({}, { status: 'one' }, values))
      return spark.save()
    }
}
