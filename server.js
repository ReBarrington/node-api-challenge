const express = require('express');

//routers
const projectRouter = require('./projectRouter.js');
const actionRouter = require('./actionRouter.js');

const server = express();

server.get('/', (req, res) => {
  res.send(`<h2>Sprint!</h2>`);
});

server.use(express.json()); // built-in middleware, no need to install it

//custom middleware


//endpoints
server.use('/api/projects', projectRouter);
server.use('/api/projects/:id/actions', actionRouter);

module.exports = server;
