const express = require('express');
const Actions = require('./data/helpers/actionModel');
const router = express.Router();

// GET /api/projects/:id/actions... Returns an array of all the action objects contained in the database:
router.get('/', (req, res) => {
  Actions.get(req.query)
  .then((actions) => {
      res.status(200).json({ queryString: req.query, actions });
  })
  .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Error retrieving actions."})
  })
})

// GET /api/action/:id... Returns the post object with the specified id:
router.get('/:id', (req, res) => {
  Actions.get(req.params.id)
  .then((action) => {
      if (action) {
          res.status(200).json(action);
      } else {
          res.status(404).json({ message: "action not found."})
      }
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error retrieving the action."})
  })
})

// DELETE /api/action/:id... Removes the action with the specified id and returns the deleted action object. You may need to make additional calls to the database in order to satisfy this requirement.
router.delete('/:id', (req, res) => {
  let id = req.params.id;
  Actions.get(id)
  .then((action) => {
      if (action) {
          try {
              Actions.remove(id)
              .then(numDeleted => {
                  res.status(202).json({ removing: action })
              })
              .catch(err => {
                  console.log(err);
              })
          }
          catch(err) {
              res.status(500).json({ message: "The action could not be removed."})
          }
      } else {
          res.status(404).json({ message: "Action not found."})
      }
  })
  .catch(err => {
      res.status(500).json({ message: "Sorry, something went wrong."})
  })
})

// PUT /api/Actions/:id.... Updates the action with the specified id using data from the request body. Returns the modified document, NOT the original.
router.put('/:id', (req, res) => {
  let id = req.params.id;
  let changes = req.body;
  // make sure not missing title or contents
  if (!req.body.description || !req.body.notes) {
      res.status(400).json({ message: "Missing description and/or notes."})
  } else {
      Actions.get(id)
      .then((action) => {
          if (action) {
              try {
                  // if action is valid: 
                  Actions.update(id, changes)
                  .then(updatedAction => {
                      if (updatedAction) {
                          // updated correctly:
                          res.status(200).json(changes)
                      }
                  })
              }
              catch(err) {
                  res.status(500).json({ errorMessage: "The action could not be removed."})
              }
          } else {
              res.status(404).json({ message: "Action not found."})
          }
      })
      .catch(err => {
          res.status(500).json({ message: "Sorry, something went wrong."})
      })
  }
})

module.exports = router;
