const { createDocument } = require('./request')

createDocument().then(resp => {
  console.log(resp)
}).catch(err => console.log(err))