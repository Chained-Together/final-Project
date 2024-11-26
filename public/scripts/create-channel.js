const createChannelrlForm = document.getElementById('createChannelForm');

createChannelrlForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = document.getElementById('name');
  const profileImage = document.getElementById('profileImage');
  const url = '/channel';
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name.value,
        profileImage: profileImage.value,
      }),
    });
    if (response.ok) {
      const redirectUrl = response.headers.get('X-Redirect-URL');
      if (data.redirectUrl) {
        window.location.href = redirectUrl; // 브라우저 리디렉션 수행
      } else {
        console.log('리디렉션 URL이 없음:', redirectUrl);
      }
    } else {
      console.error('요청 실패:', response.status);
    }
  } catch (error) {
    console.error(error);
    alert(`채널 생성 중 오류 발생: ${error.message}`);
  }
});
// 커스텀 헤더
