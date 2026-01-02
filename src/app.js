console.log('starting a new year :)')
const express = require('express');

const app = express();

// app.listen(3000)

app.listen(4000,() => {
    console.log('server is running on port 4000');
})

app.use('/', (req, res) => {
    res.send('Hello from Express server!');
});