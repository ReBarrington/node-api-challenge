const express = require('express');

//routers
const router = require('./router.js');

const server = express();

server.get('/', (req, res) => {
  res.send(`<h2>Sprint!</h2>`);
});

server.use(express.json()); // built-in middleware, no need to install it

//custom middleware


//endpoints
server.use('/api/projects', router);

module.exports = server;
