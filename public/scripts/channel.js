document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const channelNameElement = document.getElementById('channelName');
  const profileImageElement = document.getElementById('profileImage');

  if (!token) {
    channelNameElement.textContent = '로그인이 필요합니다.';
    return;
  }

  try {
    const response = await fetch('/channel', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('채널 정보를 가져오지 못했습니다.');
    }

    const channelData = await response.json();
    channelNameElement.textContent = channelData.name || '알 수 없음';
    profileImageElement.src = channelData.profileImage || '/path/to/default-profile.png';
  } catch (error) {
    console.error('오류:', error);
    channelNameElement.textContent = '채널 정보를 로드하는 중 오류가 발생했습니다.';
  }
});

const uploadBtn = document.getElementById('uploadBtn');
uploadBtn.addEventListener('click', () => {
  const token = localStorage.getItem('token');
  if (token) {
    window.location.href = '/upload';
  } else {
    window.location.href = '/login';
  }
});

// 프로필 버튼 클릭 이벤트
const profileButton = document.getElementById('profileButton');
profileButton.addEventListener('click', () => {
  window.location.href = '/mychannel';
});
