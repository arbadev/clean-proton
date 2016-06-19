'use strict'

import Service from 'proton-service'
import sha1 from 'sha1'
import hat from 'hat'

const {CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET} = process.env
const {CLOUDINARY_BUCKET_NAME} = process.env

export default class CloudinaryService extends Service {

  generateSignatureObject() {
    const id = hat()
    const time = Date.now()
    const signature = sha1(`public_id=${id}&timestamp=${time}${this.apiSecret}`)
    const uri = this.uploadUri
    const apiKey = this.apiKey
    return {id, time, signature, uri, apiKey}
  }

  get apiKey() {
    return process.env.CLOUDINARY_API_KEY
  }

  get apiSecret() {
    return process.env.CLOUDINARY_API_SECRET
  }

  get domain() {
    return `api.cloudinary.com/v1_1/${CLOUDINARY_BUCKET_NAME}`
  }

  get uploadUri() {
    return `https://${this.domain}/image/upload`
  }

}
