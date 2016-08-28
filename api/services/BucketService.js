'use strict'

import Service from 'proton-service'
import hat from 'hat'
import aws from 'aws-sdk'

const bucket = process.env.AWS_BUCKET_NAME

export default class BucketService extends Service {

  generateBucketObject() {
    const name = hat()
    const type = ''
    const s3 = new aws.S3()
    const params = {
      Bucket: bucket,
      Key: name,
      Expires: 60,
      ContentType: type,
      ACL: 'public-read'
    }
    const data = s3.getSignedUrl('putObject', params)
    const signedUri = data
    const uri = `https://${bucket}.s3.amazonaws.com/${name}`
    return {signedUri, uri}
  }

}
