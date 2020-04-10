const express = require('express');
const Projects = require('./data/helpers/projectModel');
const Actions = require('./data/helpers/actionModel.js');
const router = express.Router();

// / = /api/projects

router.use('/:id', validateProjectId);
// use validateProjectId middlewhere on all URLS that include /:id

router.get('/', (req, res) => {
    // get projects - done
    Projects.get(req.params.id)
    .then((projects) => {
      res.status(200).json({ queryString: req.query, projects })
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Error retrieving projects."})
    })
  });

router.post('/', (req, res) => {
    // add project - done
    Projects.insert(req.body)
    .then((projects) => {
      res.status(201).json(projects)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: "Error adding project."})
    })
  });

  router.get('/:id', (req, res) => {
    // see project by id - 
    Projects.get(req.params.id)
    .then((project) => {
      if (project) {
        res.status(200).json(project);
      } else {
        res.status(404).json({ message: "Error retrieving project."})
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Server error."})
    })
  });

  router.delete('/:id', (req, res) => {
    // delete project - done
    Projects.get(req.params.id)
    .then((project) => {
      if (project) {
        Projects.remove(project.id)
        .then((project) => {
          res.status(202).json(`DELETING: ${project}`)
        })
      }
    })
  });
  
  router.put('/:id', (req, res) => {
    // edit project - 
    Projects.get(req.params.id)
    .then((project) => {
      if (project) {
        Projects.update(project.id, req.body)
        .then((project) => {
          res.status(202).json(`UPDATING PROJECT WITH ID: ${project.id}`)
        })
      }
    })
  });

  router.get('/:id/actions', (req, res) => {
    // see actions by project with id - done 
    Projects.get(req.params.id)
    .then((project) => {
      if (project) {
        Projects.getProjectActions(project.id)
        .then((actions) => {
          res.status(200).json(actions)
        })
      } else {
        res.status(404).json({ message: "Project not found."})
      }
    })
  });


  router.post('/:id/actions', validateAction, (req, res) => {
    // add action (use middleware validateAction on this URL only)
    Actions.insert(req.body)
    .then((action) => {
      res.status(201).json(action);
    })
    .catch(err => console.log(err))
  });



//custom middleware
function validateProjectId( req, res, next ){
    Projects.get(req.params.id)
    .then((project) => {
      if (project) {
        req.project = project;
        next();
      } else {
        res.status(400).json({ message: "invalid project id."})
      }
    })
    .catch(err => {
      res.status(500).json({ message: "error"})
    })
  }
  function validateAction(req, res, next) {
    if (!req.body) {
      res.status(400).json({ message: "missing action data"})
    } else if (!req.body.project_id) {
      res.status(400).json({ message: "missing required project_id field."})
    } else if (!req.body.description) {
      res.status(400).json({ message: "missing required description field."})
    } else if (!req.body.notes) {
      res.status(400).json({ message: "missing required notes field."})
    } else {
      next();
    }
  }


module.exports = router;