const chatBtn = document.getElementById('chatBtn');
chatBtn.addEventListener('click', async () => {
  const roomId = 'room1'; // 방 ID 설정

  const response = await fetch(`/chat/${roomId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    const html = await response.text();
    document.open();
    document.write(html);
    document.close();
  } else {
    console.error('접속 권한이 없습니다.');
  }
});
