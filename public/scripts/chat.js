// WebSocket 서버 연결
const socket = new WebSocket('ws://localhost:3001');

// DOM 요소 참조
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// 서버로부터 메시지 수신
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const messageElement = document.createElement('div');
  messageElement.textContent = `${data.sender}: ${data.message}`;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // 자동 스크롤
};

// 메시지 전송 버튼 클릭 이벤트
sendButton.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    const messageData = {
      roomId,
      message,
      sender: username,
    };
    socket.send(JSON.stringify(messageData)); // 메시지를 WebSocket 서버로 전송
    messageInput.value = ''; // 입력 필드 초기화
  }
});

// WebSocket 연결 열림
socket.onopen = () => {
  console.log('Connected to WebSocket server');
  socket.send(JSON.stringify({ event: 'joinRoom', roomId, username }));
};

// WebSocket 연결 닫힘
socket.onclose = () => {
  console.log('Disconnected from WebSocket server');
};

// WebSocket 에러 처리
socket.onerror = (error) => {
  console.error('WebSocket error:', error);
};
