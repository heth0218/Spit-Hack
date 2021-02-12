const { Router } = require('express')
const controller = require('../controller/user')
const { check } = require('express-validator')

const router = Router();

const { register, login } = controller;

//Register user
router.post('/register', [
    check('name', 'Please enter a name').not().isEmpty(),
    check('email', 'Enter a valid email address').isEmail()
], register);

router.post('/login', [
    check('email', 'Please enter a valid email id').isEmail(),
    check('password', 'Password is required').exists()
], login);


module.exports = router;