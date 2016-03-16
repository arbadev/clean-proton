export default {

  stores: {
    mongo: {
      connection: {
        host: 'localhost',
        port: process.env.DB_PORT_27017_TCP_PORT,
      },
      adapter: 'mongoose'
    }
  },

  store: 'mongo'

}
