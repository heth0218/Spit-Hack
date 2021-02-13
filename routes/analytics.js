const { Router } = require('express')
const controller = require('../controller/analytics')
const auth = require('../middleware/auth')

const router = Router();

const { createAnalytics, getAnalytics } = controller;

router.post('/createAnalytics', auth, createAnalytics)

router.post('/getAnalytics', auth, getAnalytics)

module.exports = router;