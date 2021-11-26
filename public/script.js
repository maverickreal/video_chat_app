let stream = null,
    video = document.createElement('video'),
    videoGrid = document.getElementById('videoGrid'),
    socket = io('/'),
    roomId = '<%= roomId %>',
    peer = new Peer(undefined, {
        path: '/peerjs',
        host: '/',
        port: '3000'
    }),
    peers = {};

video.muted = true;

const addStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => video.play());
    videoGrid.append(video);
}

navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(Stream => {
    stream = Stream;
    addStream(video, stream);

    peer.on('call', call => {
        call.answer(stream);
        const Video = document.createElement('video');
        call.on('stream', userStream => addStream(Video, userStream));
    });

    socket.on('userJoined', userId => {

        const call = peer.call(userId, stream),
            video = document.createElement('video');

        call.on('stream', userStream => addStream(video, userStream));

        call.on('close', () => video.remove());

        peers[userId] = call;

    });
});

const message = $('input');

$('html').keydown(e => {
    console.log(message);
    if (e.which == 13 && message.val().length !== 0) {
        socket.emit('message', message.val());
        message.val('');
    }
});

socket.on('createMessage', msg => {
    $('ul').append(`<li class="message"><b>user</b><br/>${msg}</li>`);
    console.log(msg);
});

peer.on('open', id => socket.emit('joinRoom', roomId, id));