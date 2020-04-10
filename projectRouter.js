const express = require('express');
const Projects = require('./data/helpers/projectModel');
const Actions = require('./data/helpers/actionModel.js');
const router = express.Router();

// routing for = /api/projects

router.use('/:id', validateProjectId);
// use validateProjectId middlewhere on all URLS that include /:id

// GET /api/projects - get all projects...
router.get('/', (req, res) => {
    Projects.get(req.params.id)
    .then((projects) => {
      res.status(200).json({ queryString: req.query, projects })
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Error retrieving projects."})
    })
  });

// POST /api/projects - add a project...
router.post('/', (req, res) => {
    Projects.insert(req.body)
    .then((projects) => {
      res.status(201).json(projects)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: "Error adding project."})
    })
  });

// GET /api/projects/:id - see a project by id...
router.get('/:id', (req, res) => {
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

// DELETE /api/projects:id - delete a project... 
router.delete('/:id', (req, res) => {

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

// PUT /api/projects:id - edit a project...
router.put('/:id', (req, res) => {
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

// GET /api/projects/:id/actions - see all actions inside a project...
router.get('/:id/actions', (req, res) => {
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

// POST /api/projects/:id/actions - add a action (use middleware validateAction on this URL only)...
router.post('/:id/actions', validateAction, (req, res) => {
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