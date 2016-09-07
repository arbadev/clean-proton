'use strict'

import Service from 'proton-service'
import sha1 from 'sha1'
import hat from 'hat'

const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env
const { CLOUDINARY_BUCKET_NAME } = process.env

const PIXELATION_LEVEL_1 = 50
const PIXELATION_LEVEL_2 = 30

export default class CloudinaryService extends Service {

  generateSignatureObject() {
    const id = hat()
    const time = Date.now()
    const signature = sha1(`public_id=${id}&timestamp=${time}${this.apiSecret}`)
    const uri = this.uploadUri
    const apiKey = this.apiKey
    return { id, time, signature, uri, apiKey }
  }

  pixelateUrlOfLevel1(url) {
    return this.pixelateUrl(url, PIXELATION_LEVEL_1)
  }

  pixelateUrlOfLevel2(url) {
    return this.pixelateUrl(url, PIXELATION_LEVEL_2)
  }

  pixelateUrl(url, pixelation) {
    const baseUrl = `res.cloudinary.com/${CLOUDINARY_BUCKET_NAME}/image/upload`
    const pixelatedUrl = `https://${baseUrl}/e_pixelate:${pixelation}`
    const regexp = `(http|https)://${baseUrl}`
    return url.replace(new RegExp(regexp), pixelatedUrl)
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
