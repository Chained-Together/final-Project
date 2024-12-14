const chatBtn = document.getElementById('chatBtn');
chatBtn.addEventListener('click', async () => {
  const roomId = 'main-room'; // 또는 동적으로 생성된 roomId
  window.location.href = `/chat/${roomId}`;

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
