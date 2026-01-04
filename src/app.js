const express = require('express');

const connectDB =  require('../src/config/database')

const app = express();

connectDB()
  .then(() => {
    console.log("DB connected successfully");
    app.listen(4000,() => {
    console.log('server is running on port 4000');
})
  })
  .catch((err) => {
    console.log("DB connecttion err:", err);
    return err;
  });

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

// app.get('/user',(req,res,next) => {
//     console.log('user console 1')
//     next()
// },(req,res,next) => {
//     console.log('user console 2');
//     next()
// },(req,res,next) => {
//     console.log('user console 3')
//     res.send('uuser consolle 3')
// })