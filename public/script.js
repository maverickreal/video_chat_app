let videoStream, video = document.createElement('video');
video.muted = true;

const videoGrid = document.getElementById('videoGrid'),
    socket = io('http://localhost:3000'),
    roomId = '<%= roomId %>';


const addVideostream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => video.play());
    videoGrid.appendChild(video);
}

socket.emit('joinRoom', roomId);
socket.on('userJoined', () => {
    console.log('New User!');
});

navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
    videoStream = stream;
    addVideostream(video, stream);
});