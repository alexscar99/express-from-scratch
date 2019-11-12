const express = require('./src/express');
const app = express();

app.get('/', (req, res) => {
  res.writeHead(200);
  res.write('Hello, World');
  res.end();
});

app.listen(5000, () => console.log('Example app listening on port 5000!'));
