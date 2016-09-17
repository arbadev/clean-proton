
import Service from 'proton-service'
import Model from 'proton-mongoose-model'
import firebase from 'firebase'

/*
 * -----------------------------------------------------------------------------
 *                                Constants
 * -----------------------------------------------------------------------------
 */

const databaseURL = process.env.FIREBASE_DB
const projectId = process.env.FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
const serviceAccount = { projectId, clientEmail, privateKey }

firebase.initializeApp({ serviceAccount, databaseURL })

const db = firebase.database()
const users = db.ref('users')

export default class FirebaseService extends Service {
  generateToken(id) {
    return firebase.auth().createCustomToken(id)
  }
}

/*
 * -----------------------------------------------------------------------------
 *                             FireBase Events
 * -----------------------------------------------------------------------------
 */

users.on('child_changed', snap => {
  const _id = Model.parseObjectId(snap.key)
  const { location } = snap.val()
  const coordinates = [parseFloat(location.lat), parseFloat(location.lng)]
  User.findOneAndUpdate({ _id }, { coordinates })
    .then(user => proton.log.silly(`Coordinates updated for ${user._id}`))
})
