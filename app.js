const express = require('express'),
    app = express(),
    server = app.listen(3000),
    { v4: uuid } = require('uuid'),
    io = require('socket.io')(server),
    { ExpressPeerServer } = require('peer'),
    peerServer = ExpressPeerServer(server, { debug: true });

app.use('/peerjs', peerServer);
app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.set('view engine', 'ejs');
//app.set('views', './views');

app.get('/', (req, res) => {
    res.redirect(`${uuid()}`);
});
app.get('/:roomId', (req, res) => {
    res.status(200).render('room', { roomId: req.params.roomId });
});

io.on('connection', socket => {
    socket.on('joinRoom', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('userJoined', userId);
    });
});