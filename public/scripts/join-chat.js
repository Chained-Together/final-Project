const chatBtn = document.getElementById('chatBtn');
chatBtn.addEventListener('click', async () => {
  const roomId = 'room1'; // 방 ID 설정
  const token = localStorage.getItem('token'); // 로컬 스토리지에서 JWT 가져오기

  if (!token) {
    alert('로그인이 필요합니다.');
    window.location.href = '/login';
    return;
  }

  const response = await fetch(`/chat/${roomId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`, // 헤더에 JWT 추가
    },
  });

  if (response.ok) {
    const html = await response.text();
    document.open();
    document.write(html);
    document.close();
  } else {
    alert('접속 권한이 없습니다.');
  }
});
