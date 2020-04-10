const express = require('express');

//routers

const server = express();

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use(express.json()); // built-in middleware, no need to install it

//custom middleware


//endpoints


module.exports = server;
