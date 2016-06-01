'use strict'

import Controller from 'proton-controller'

export default class UserController extends Controller {

  /**
   * @method create
   * @description
   */
  * me() {
    try {
      this.response.body = yield User.me(this.request.user._id)
    } catch (err) {
      proton.log.error('UserController.create', err)
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
   *
   */
  * uploadAvatar() {
    proton.log.debug('files on upload avatar', this.req.files)
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
    proton.log.debug('files on upload message', this.req.files)
    const userId = this.request.user._id
    proton.log.debug('userId', userId)
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
   *
   *
   */
  * destroy() {
    try {
      const user = yield User.destroy(this.params.id)
      this.response.body = user
      this.response.status = !user ? 404 : 200
    } catch (e) {
      this.response.status = 400
    }
  }

  /**
   *
   *
   */
  * find() {
    const { query } = this
    try {
      this.response.body = yield User.findQ(query)
    } catch (err) {
      proton.log.error('UserController.find', err)
      this.response.status = 400
    }
  }
}
