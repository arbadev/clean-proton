import Service from 'proton-service'
import aws from 'aws-sdk'
import fs from 'fs'
import _ from 'lodash'

aws.config.update({ region: 'us-west-2' })
const s3 = new aws.S3()

/**
 * @class StorageService
 * @description
 *
 */
export default class StorageService extends Service {

  /**
   * @method upload
   * @description
   */
  upload(files) {
    const promises = []
    files = Array.isArray(files) ? files : [files]
    files.forEach(file => promises.push(upload(file)))
    return Promise.all(promises)
  }
}


/**
 * @method upload
 * @description
 */
function upload(file) {
  return new Promise((resolve, reject) => {
    const object = buildObject(file)
    s3.upload(object, (err, data) => err ? reject(err) : resolve(data.Location))
  })
}

  /**
   * @method _buildObject
   * @description
   */
function buildObject(file) {
  const body = fs.createReadStream(file.path)
  return {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file.name,
    Body: body,
    ContentType: file.mimetype,
  }
}
