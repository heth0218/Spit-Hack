const { Router } = require('express')
const controller = require('../controller/analytics')
const auth = require('../middleware/auth')

const router = Router();

const { createAnalytics, getAnalytics, getLatestAnalytics } = controller;

router.post('/createAnalytics', auth, createAnalytics)

router.post('/getAnalytics', auth, getAnalytics)

router.post('/getLatestAnalytics', getLatestAnalytics)

module.exports = router;