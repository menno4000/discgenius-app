// const fs = require('fs');


module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: process.env.NODE_ENV === 'production'
      ? '/discgenius-app/'
      : '/',
  devServer: {
    port: 8080,
    // https: {
    //   key: fs.readFileSync('./certs/privkey.pem'),
    //   cert: fs.readFileSync('./certs/cert.pem')
    // },
    proxy: 'https://menno4000.github.io/discgenius-app'
  },

}
