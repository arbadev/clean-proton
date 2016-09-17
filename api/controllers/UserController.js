'use strict'

import Controller from 'proton-controller'

export default class UserController extends Controller {

  /**
   *
   *
   */
  * find() {
    const { user } = this.request
    const params = this.query
    const opts = { user, params }
    try {
      this.response.body = yield User.findByQueryParams(opts)
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
      this.response.body = yield User.me({ _id: user._id })
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
      const { _id } = this.request.user
      this.response.body = yield User.me({ _id })
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
      const { _id } = this.request.user
      const values = this.request.body
      yield User.findOneAndUpdate({ _id }, values)
      this.response.body = yield User.me({ _id })
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

  * like() {
    const [from, to] = [this.request.user._id, this.params.id]
    try {
      const like = yield Like.create({ to, from, value: 'like' })
      this.response.status = 201
      this.response.body = like
    } catch (err) {
      const message = `An error ocurred creating a like for the user ${to}`
      proton.log.error(message, err)
      this.response.status = 400
    }
  }

  * dislike() {
    const [from, to] = [this.request.user._id, this.params.id]
    try {
      const like = yield Like.create({ to, from, value: 'dislike' })
      this.response.status = 201
      this.response.body = like
    } catch (err) {
      const message = `An error ocurred creating a like for the user ${to}`
      proton.log.error(message, err)
      this.response.status = 400
    }
  }


}
