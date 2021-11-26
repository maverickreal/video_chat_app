let videoStream = null, video = document.createElement('video');
video.muted = true;

const videoGrid = document.getElementById('videoGrid'),
    socket = io('http://localhost:3000'),
    roomId = '<%= roomId %>',
    peer = new Peer(undefined, {
        path: '/peerjs',
        host: '/',
        port: '3000'
    });

const addVideostream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => video.play());
    videoGrid.appendChild(video);
}

navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
    videoStream = stream;
    addVideostream(video, stream);
});

peer.on('open', id => socket.emit('joinRoom', roomId, id));

socket.on('userJoined', userId => {
    console.log(`New User! ${userId}`);
});