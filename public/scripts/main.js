document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const profileImageElements = document.querySelectorAll('.profileImage');

  const setImageSrc = (src) => {
    profileImageElements.forEach((img) => {
      img.src = src;
    });
  };

  if (!token) {
    setImageSrc('/path/to/default-profile.png');
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
      throw new Error('프로필 정보를 가져오지 못했습니다.');
    }

    const profileData = await response.json();
    const profileImageUrl = profileData.profileImage || '/path/to/default-profile.png';
    setImageSrc(profileImageUrl);
  } catch (error) {
    console.error('오류:', error);
    setImageSrc('/path/to/default-profile.png');
  }
});

async function loadInfos() {
  try {
    const response = await fetch('/video', { method: 'GET' });

    if (!response.ok) {
      throw new Error('썸네일을 가져오지 못했습니다.');
    }

    const videos = await response.json();

    // shortform-grid 컨테이너 가져오기
    const shortformGrid = document.querySelector('.shortform-grid');

    shortformGrid.innerHTML = '';

    // 비디오 데이터 렌더링
    videos.forEach((video) => {
      // 유효하지 않은 비디오 데이터 건너뛰기
      if (!video || (!video.thumbnailUrl && !video.title)) {
        console.warn('유효하지 않은 비디오 데이터:', video);
        return;
      }

      // 비디오 카드 생성
      const shortformItem = document.createElement('div');
      shortformItem.className = 'shortform-item';

      // 썸네일 추가
      if (video.thumbnailUrl) {
        const placeholderVideo = document.createElement('div');
        placeholderVideo.className = 'placeholder-video';
        placeholderVideo.style.backgroundImage = `url(${video.thumbnailUrl})`;
        shortformItem.appendChild(placeholderVideo);
      }

      // 제목 추가
      if (video.title) {
        const placeholderTitle = document.createElement('div');
        placeholderTitle.className = 'placeholder-title';
        placeholderTitle.textContent = video.title;
        shortformItem.appendChild(placeholderTitle);
      }

      // // 설명 추가
      // if (video.description) {
      //   const placeholderDescription = document.createElement('div');
      //   placeholderDescription.className = 'placeholder-description';
      //   placeholderDescription.textContent = `설명: ${video.description}`;
      //   shortformItem.appendChild(placeholderDescription);
      // }

      // // 해시태그 추가
      // if (video.hashtags) {
      //   const placeholderHashtags = document.createElement('div');
      //   placeholderHashtags.className = 'placeholder-hashtags';
      //   placeholderHashtags.textContent = `해시태그: ${video.hashtags}`;
      //   shortformItem.appendChild(placeholderHashtags);
      // }

      // 완성된 비디오 아이템을 그리드에 추가
      shortformGrid.appendChild(shortformItem);
    });

    // 비디오 데이터가 없을 경우
    if (videos.length === 0) {
      shortformGrid.innerHTML = '<p>비디오가 없습니다.</p>';
    }
  } catch (error) {
    console.error('오류 발생:', error);
    const shortformGrid = document.querySelector('.shortform-grid');
    shortformGrid.innerHTML = '<p>비디오를 가져오는 데 실패했습니다.</p>';
  }
}

// 초기 로드
loadInfos();

const profileBtn = document.getElementById('profileBtn');
profileBtn.addEventListener('click', () => {
  const token = localStorage.getItem('token');
  if (token) {
    window.location.href = '/mychannel';
  } else {
    window.location.href = '/login';
  }
});

const accountBtn = document.getElementById('accountBtn');
const createLogoutButton = () => {
  const logoutButton = document.createElement('button');
  logoutButton.textContent = '로그아웃';
  logoutButton.id = 'logoutBtn';
  logoutButton.style = `
      position: absolute;
      top: 60px;
      right: 30px;
      background-color: #fff;
      color: #000;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      z-index: 1000;
    `;

  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    alert('로그아웃 되었습니다.');
    window.location.href = '/main';
  });

  return logoutButton;
};

accountBtn.addEventListener('click', () => {
  const token = localStorage.getItem('token');

  if (token) {
    let logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn) {
      logoutBtn = createLogoutButton();
      document.body.appendChild(logoutBtn);
    } else {
      logoutBtn.remove();
    }
  } else {
    window.location.href = '/main';
  }
});
