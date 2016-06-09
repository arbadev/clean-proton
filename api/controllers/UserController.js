'use strict'

import Controller from 'proton-controller'

export default class UserController extends Controller {

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
      this.response.body = {}
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
      this.response.body = {}
    } catch (err) {
      proton.log.error('UserController.findMe', err)
      this.response.status = 400
    }
  }

  /**
   * @description
   * @author Carlos Marcano
   */
  * findOne() {
    try {
      this.response.body = {}
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
      const user = yield User.destroy(this.params.id)
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
      this.response.body = {}
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
