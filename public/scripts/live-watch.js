document.addEventListener('DOMContentLoaded', async () => {
  const videoPlayer = document.getElementById('videoPlayer');
  const chatBox = document.getElementById('chat-box');
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');

  const streamId = window.location.pathname.split('/').pop();
  const token = localStorage.getItem('token');
  let nickname = null;

  if (!token) {
    messageInput.placeholder = '로그인 후 채팅이 가능합니다';
  } else {
    messageInput.placeholder = '메시지를 입력하세요';
    const decoded = JSON.parse(atob(token.split('.')[1]));
    nickname = decoded.nickname;
  }

  try {
    // 스트림 정보 가져오기
    const response = await fetch(`/liveStreaming/${streamId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('스트림 정보를 가져올 수 없습니다.');

    const streamData = await response.json();

    // 스트림 정보 설정
    document.getElementById('streamTitle').textContent = streamData.title;
    document.getElementById('streamerProfile').src =
      streamData.profileImage || '/public/images/user-50.png';
    document.getElementById('streamerName').textContent = streamData.channelName;

    // HLS 플레이어 설정
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamData.streamingUrl);
      hls.attachMedia(videoPlayer);
    }

    // 소켓 연결
    const socket = io('http://localhost:3001', {
      auth: { token },
      query: { streamId },
    });

    socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('receiveMessage', (data) => {
      const messageElement = document.createElement('div');
      messageElement.className = 'message';
      messageElement.innerHTML = `
                <span class="username">${data.sender}</span>
                <span class="message-text">${data.message}</span>
            `;
      chatBox.appendChild(messageElement);
      chatBox.scrollTop = chatBox.scrollHeight;
    });

    // 메시지 전송
    const sendMessage = () => {
      const messageInput = document.getElementById('message-input');
      const message = messageInput.value.trim();
      const token = localStorage.getItem('token');

      if (!token) {
        messageInput.value = '';
        messageInput.placeholder = '로그인 후 채팅이 가능합니다';

        if (confirm('로그인 페이지로 이동하시겠습니까?')) {
          window.location.href = '/login';
        } else {
          messageInput.placeholder = '로그인 후 채팅이 가능합니다';
        }
        return;
      }

      if (message) {
        socket.emit('sendMessage', { streamId, message, sender: nickname });
        messageInput.value = '';
        messageInput.placeholder = '메시지를 입력하세요';
      }
    };

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });
  } catch (error) {
    console.error('Error:', error);
    alert('스트림을 불러오는데 실패했습니다.');
  }
});
