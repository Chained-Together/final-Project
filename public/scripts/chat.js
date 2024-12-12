const socket = io('http://localhost:3001'); // Socket.IO 서버와 연결

const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// 서버로부터 메시지 수신
socket.on('receiveMessage', (data) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = `${data.sender}: ${data.message}`;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // 자동 스크롤
});

// 메시지 전송 버튼 클릭 이벤트
sendButton.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    const messageData = {
      roomId,
      message,
      sender: username,
    };
    socket.emit('sendMessage', messageData); // 메시지를 Socket.IO 서버로 전송
    messageInput.value = ''; // 입력 필드 초기화
  }
});

// 서버 연결 성공
socket.on('connect', () => {
  console.log('Connected to WebSocket server');
  socket.emit('joinRoom', { roomId, username });
});

// 연결 해제
socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});

// 에러 처리
socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});
