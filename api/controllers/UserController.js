'use strict'

import Controller from 'proton-controller'

export default class UserController extends Controller {

  /**
   *
   *
   */
  * find() {
    // const { query } = this
    try {
      this.response.body = yield User.find({ _id: { $ne: this.request.user._id } })
      // this.response.body = yield User.findByQueryParams(query, this.request.user)
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
   *
   */
  * uploadAvatar() {
    const userId = this.request.user._id
    const { StorageService } = proton.app.services
    try {
      const [avatar] = yield StorageService.upload(this.req.files.avatar)
      const user = yield User.updateOne(userId, { avatar })
      this.response.body = user
    } catch (err) {
      proton.log.error('UserController.uploadAvatar', err)
      this.response.status = 400
    }
  }

   /**
    *
    */
  * uploadMessage() {
    const userId = this.request.user._id
    const { StorageService } = proton.app.services
    try {
      const [message] = yield StorageService.upload(this.req.files.message)
      const user = yield User.updateOne(userId, { message })
      this.response.body = user
    } catch (err) {
      proton.log.error('UserController.uploadMessage', err)
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
      this.response.body = yield User.findOne({ _id: userId })
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
    proton.log.debug('findSparkd')
    try {
      const { sparkdId } = this.params
      const { user } = this.request
      const criteria = {
        _id: sparkdId,
        'mates.user': user._id,
      }
      const spark = yield Spark.findOne(criteria).populate('mates.user')
      proton.log.debug('spark.toJSON', spark.toJSON())
      this.response.body = spark
    } catch (err) {
      proton.log.error('UserController.findSparkd', err)
      this.response.status = 400
    }
  }

  /**
   * @description
   * @author Carlos Marcano
   */
  * updateSparkd() {
    try {
      this.response.body = {}
    } catch (err) {
      proton.log.error('UserController.updateSparkd', err)
      this.response.status = 400
    }
  }

}
