'use strict'

import Service from 'proton-service'
import hat from 'hat'
import aws from 'aws-sdk'

const bucket = process.env.AWS_BUCKET_NAME

export default class BucketService extends Service {

  generateBucketObject() {
    const name = `${hat()}.mp3`
    const type = 'audio/mpeg'
    aws.config.update({
      region: 'us-east-1',
    })
    const s3 = new aws.S3()
    const params = {
      Bucket: bucket,
      Key: name,
      Expires: 200,
      ContentType: type,
      ACL: 'public-read',
    }
    const signedUri = s3.getSignedUrl('putObject', params)
    const uri = `https://${bucket}.s3.amazonaws.com/${name}`
    return { signedUri, uri }
  }

}
