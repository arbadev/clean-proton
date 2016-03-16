export default {

  stores: {
    mongo: {
      connection: {
        username: process.env.MONGOLAB_USERNAME || '',
        password: process.env.MONGOLAB_PASSWORD || '',
        host: process.env.MONGOLAB_HOST || 'localhost',
        port: process.env.MONGOLAB_PORT || 27017,
        database: process.env.MONGOLAB_DATABASE || 'persona-test'
      },
      adapter: 'mongoose'
    }
  },

  store: 'mongo'

}
