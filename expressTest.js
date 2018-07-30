const express = require('express');
const app = express();

app.use(express.static('http'))

app.get('/', (reg,res) => res.send('Hello World'))

app.listen(3000, () => console.log('listening on port 3000!'));