console.log('starting a new year :)')
const express = require('express');

const app = express();

// app.listen(3000)

app.listen(4000,() => {
    console.log('server is running on port 4000');
})

// app.use('/hello/2', (req, res) => {
//     res.send('Hello from Hello Page 2!');
// });

// app.use('/hello', (req, res) => {
//     res.send('Hello from Hello Page!');
// });

// app.use('/', (req, res) => {
//     res.send('Hello from Express server!');
// });

// app.use('/helloworld', (req, res) => {
//     res.send('Hello from Hello Page!');
// });

// app.get('/user', (req, res) => {
//     res.send('User route');
// });

// app.post('/user', (req, res) => {
//     res.send('User POST route');
// });

app.get('/user',(req,res,next) => {
    console.log('user console 1')
    next()
},(req,res,next) => {
    console.log('user console 2');
    next()
},(req,res,next) => {
    console.log('user console 3')
    res.send('uuser consolle 3')
})