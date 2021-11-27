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

const scrollToBottom = () => {
    let d = $('.mainChatWindow');
    d.scrollTop(d.prop('scrollHeight'));
}

const setPlayVideo = () => {
    const html = `<i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>`;
    document.querySelector('.mainVideoButton').innerHTML = html;
}

const setPauseVideo = () => {
    const html = `<i class="fas fa-video"></i>
    <span>Stop Video</span>`;
    document.querySelector('.mainVideoButton').innerHTML = html;
}

const playPause = () => {
    const enabled = stream.getVideoTracks()[0].enabled;
    if (enabled) {
        stream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    }
    else {
        stream.getVideoTracks()[0].enabled = true;
        setPauseVideo();
    }
}

const setMuteButton = () => {
    const html = `<i class="fas fa-microphone"></i>
    <span>Mute</span>`;
    document.querySelector('.mainMuteButton').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `<i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>`;
    document.querySelector('.mainMuteButton').innerHTML = html;
}

const muteUnmute = () => {
    const enabled = stream.getAudioTracks()[0].enabled;
    if (enabled) {
        stream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }
    else {
        stream.getAudioTracks()[0].enabled = true;
        setMuteButton();
    }
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
    scrollToBottom();
});

peer.on('open', id => socket.emit('joinRoom', roomId, id));