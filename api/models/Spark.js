  'use strict'

  import Model from 'proton-mongoose-model'


  const statuses = ['one', 'two,', 'three', 'finishied']
  const levelSchema = {
    one: { decision: Boolean },
    two: { decision: Boolean, message: String },
    three: { decision: Boolean },
  }
  const mateSchema = {
    user: { type: Model.types.ObjectId, required: true },
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


    afterCreate(record, next) {
      const pushMessage = {
        event: 'update spark',
        data: { spark: record._id },
      }
      const { NotificationService } = proton.app.services
      NotificationService.sendPush(record.mates[0], pushMessage)
      NotificationService.sendPush(record.mates[1], pushMessage)
      next()
    }

  /**
   * @description this method gets the params (from , to), and find if a Spark
   alredy exist with those users, if exist it will update the data with their
   answers, otherwise create a new spark with the undefined status waiting for
   the other User asnwer
   * @author Andres Barradas <andres@nucleos.io>
   * @param from: this always will be the client who ask for a relationship
   * @param to: is the user which its asked for a relationship
   */
    static * create(values) {
      const spark = new this(Object.assign({}, { status: 'one' }, values))
      return spark.save()
    }

  /**
   * @description this method gets the params (from , to), and find a spark where
   the users are and update their relationship
   * @author Andres Barradas <andres@nucleos.io>
   * @param from: this always will be the client which want to start the next lv
   * @param level: {two: { decision: true, message: 'url' } }
   */
    static * updateLevel(id, userId, level) {
      const criteria = { _id: new Model.types.ObjectId(id) }
      const spark = yield Spark.findOne(criteria)
      const sparkMate = spark.from.user == userId ? spark.to : spark.from
      const [levelName] = Object.getOwnPropertyNames(level)
      const decision = level[levelName].decision
      let status = ''

      if (!decision) {
        status = 'terminated'
      } else if (sparkMate.levels[levelName] && sparkMate.levels[levelName].decision) {
        status = levelName
      } else {
        status = spark.status
      }

      const key = spark.from.user == userId ? 'from' : 'to'
      const keyLevels = `${key}.levels`
      const updateData = {
        status,
        [keyLevels]: Object.assign({}, spark[key].levels, level),
      }

      const updatedSpark = yield Spark.findOneAndUpdate(criteria, updateData, { new: true })
      const pushMessage = {
        event: 'update spark',
        data: { _id: id },
      }
      const { NotificationService } = proton.app.services
      NotificationService.sendPush(sparkMate.user, pushMessage)
      return Promise.resolve(updatedSpark)
    }

}
