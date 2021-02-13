const Pusher = require('pusher');

var pusher = new Pusher({
    appId: '1116653',
    key: '5dbf8c4a4db56c1115e3',
    secret: 'dea7c9490b6b80d3ebe2',
    cluster: 'ap2',
    useTLS: true,
});
console.log(pusher);
module.exports = pusher;