const axios = require('axios');
const url = `http://localhost:4000`;

axios({
  url: url,
  method: 'post',
  data: {
    query: `
      mutation {
        create(
          absolutePath: "aaa"
          content: "123"
        ){
          id,
          absolutePath,
          content
         }
        }
      `
  }
}).then((result) => {
  console.log(result.data)
});