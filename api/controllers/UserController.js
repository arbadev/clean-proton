'use strict'

import Controller from 'proton-controller'
import _ from 'lodash'

export default class UserController extends Controller {

  constructor(app) {
    super(app)
  }

  /**
   * @method create
   * @description
   */
  * create() {
    proton.log.debug('create', this.request.body)
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
     const userId = this.request.user._id
     try {
       const [avatar] = yield StorageService.upload(this.req.files.avatar)
       const user = yield User.updateOne(userId, {avatar})
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
      proton.log.debug('uploadMessage . . . ', this.req.files)
      const userId = this.request.user._id
      try {
        const [message] = yield StorageService.upload(this.req.files.message)
        const user = yield User.updateOne(userId, {message})
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

}
