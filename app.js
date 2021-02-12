const express = require('express');
const cors = require('cors');
const db = require('./config/db')

const app = express();

db();

app.use(express.json({ extended: false }));
app.use(cors());

//Routes
app.use('/api/user', require('./routes/user'))

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.get('/', (req, res) => {
    res.send({
        msg: 'How you doin!'
    })
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})