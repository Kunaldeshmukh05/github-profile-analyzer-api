const express = require('express');
const router  = express.Router();
const githubController = require('../controllers/githubController');

router.post('/analyze',         githubController.analyzeProfile);
router.get('/profiles',         githubController.getAllProfiles);
router.get('/profiles/:id',     githubController.getProfileById);

module.exports = router;
