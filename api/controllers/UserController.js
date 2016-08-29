'use strict'

import Controller from 'proton-controller'

export default class UserController extends Controller {

  /**
   *
   *
   */
  * find() {
    const { user } = this.request
    const query = Object.assign({}, this.query, { user })
    try {
      this.response.body = yield User.findByQueryParams(query)
    } catch (err) {
      proton.log.error('UserController.find', err)
      this.response.status = 400
    }
  }

  /**
   * @method create
   * @description
   */
  * create() {
    try {
      const user = yield User.create(this.request.body)
      this.response.body = user
      this.response.status = 201
    } catch (err) {
      proton.log.error('UserController.create', err)
      this.response.status = 400
    }
  }

  /**
   * @method findMe
   * @description
   */
  * findMe() {
    try {
      const userId = this.request.user._id
      this.response.body = yield User.me(userId)
    } catch (err) {
      proton.log.error('UserController.findMe', err)
      this.response.status = 400
    }
  }

  /**
   * @method updateMe
   * @description
   */
  * updateMe() {
    try {
      const userId = this.request.user._id
      const values = this.request.body
      const userUpdated = yield User.updateOne(userId, values)
      this.response.body = userUpdated
      this.response.status = 200
    } catch (err) {
      proton.log.error('UserController.updateMe', err)
      this.response.status = 400
    }
  }

  /**
   * @description
   * @author Carlos Marcano
   */
  * findOne() {
    try {
      const { userId } = this.params
      this.response.body = yield User.findOneById(userId)
    } catch (err) {
      proton.log.error('UserController.findOne', err)
      this.response.status = 400
    }
  }

  /**
   * @description
   * @author Carlos Marcano
   */
  * destroy() {
    try {
      const user = yield User.destroy(this.params.userId)
      this.response.body = user
      this.response.status = !user ? 404 : 200
    } catch (err) {
      proton.log.error('UserController.destroy', err)
      this.response.status = 400
    }
  }

  /**
   * @description
   * @author Carlos Marcano
   */
  * findSparkds() {
    try {
      this.response.body = {}
    } catch (err) {
      proton.log.error('UserController.findSparkds', err)
      this.response.status = 400
    }
  }

  /**
   * @description
   * @author Carlos Marcano
   */
  * findSparkd() {
    try {
      const { sparkdId } = this.params
      const { user } = this.request
      const criteria = {
        _id: sparkdId,
        'mates.user': user._id,
      }
      const spark = yield Spark.findOne(criteria)
        .populate('mates.user')

      // TODO: Make this with deep populate
      spark.mates[0].user.languages = yield Language.find(
        { _id: { $in: spark.mates[0].user.languages } })
      spark.mates[1].user.languages = yield Language.find(
          { _id: { $in: spark.mates[1].user.languages } })

      this.response.body = spark
    } catch (err) {
      proton.log.error('UserController.findSparkd', err)
      this.response.status = 400
    }
  }

  * like() {
    const [from, to] = [this.request.user._id, this.params.id]
    try {
      const like = yield Like.create({ to, from, value: 'like' })
      console.log(like)
      this.response.status = 201
      this.response.body = like
    } catch (err) {
      const message = `An error ocurred creating a like for the user ${to}`
      proton.log.error(message, err)
      this.response.status = 400
    }
  }

}
