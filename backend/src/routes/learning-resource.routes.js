const express = require('express'); const { protect } = require('../middleware/auth'); const controller = require('../controllers/learning-resource.controller'); const router = express.Router();
router.get('/search', protect, controller.searchResources); router.get('/saved', protect, controller.getSavedResources); router.post('/saved', protect, controller.saveResource); router.delete('/saved/:id', protect, controller.removeResource);
module.exports = router;
