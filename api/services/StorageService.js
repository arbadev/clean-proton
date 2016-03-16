'use strict'

import Service from 'proton-service'
import aws from 'aws-sdk'
import fs from 'fs'
import _ from 'lodash'

// Declarative section
const s3 = new aws.S3()

/**
 * @class StorageService
 * @description
 *
 */
export default class StorageService extends Service {

  constructor(app) {
    super(app)
    this.s3 =
    aws.config.update({
      region: 'us-west-2'
    })
  }

  /**
   * @method upload
   * @description
   */
  upload(files) {
    const promises = new Array()
    if (_.isArray(files)) {
      files.forEach(file => promises.push(this._upload(file)))
    } else {
      promises.push(this._upload(files))
    }
    return Promise.all(promises)
  }

  /**
   * @method _upload
   * @description
   */
  _upload(file) {
    return new Promise((resolve, reject) => {
      const opts = this._buildObject(file)
      s3.upload(opts, (err, data) => {
        if (err) return reject(err)
        return resolve(data.Location)
      })
    })
  }

  /**
   * @method _buildObject
   * @description
   */
  _buildObject(file) {
    const body = fs.createReadStream(file.path)
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.name,
      Body: body,
      ContentType: file.mimetype
    }
  }

}
