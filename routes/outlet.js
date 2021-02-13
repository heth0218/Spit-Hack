const { Router } = require('express')
const controller = require('../controller/outlet')
const auth = require('../middleware/auth')

const router = Router();

const { makeOutlet, getAllOutlets } = controller;

router.post('/createOutlet', auth, makeOutlet)

router.get('/getOutlets', auth, getAllOutlets)

module.exports = router;