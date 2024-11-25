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
  // 이미지 가져와!
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

    const thumbnails = document.querySelectorAll('.placeholder-video');
    const titles = document.querySelectorAll('.placeholder-title');
    const descriptions = document.querySelectorAll('.placeholder-description');
    const hashtags = document.querySelectorAll('.placeholder-hashtags');

    thumbnails.forEach((placeholder, index) => {
      const video = videos[index];
      console.log(video);
      const thumbnailUrl = video?.thumbnailUrl || '/path/to/default-thumbnail.png';

      placeholder.style.backgroundImage = `url(${thumbnailUrl})`;
    });

    titles.forEach((titleElement, index) => {
      const video = videos[index];
      const title = video?.title || '기본 제목';
      titleElement.textContent = title;
    });
    descriptions.forEach((descElement, index) => {
      const video = videos[index];
      const description = video?.description || '기본 설명';
      descElement.textContent = description;
    });
    hashtags.forEach((hashtageElement, index) => {
      const video = videos[index];
      const hashtag = video?.hashtags || '#해시태그';
      hashtageElement.textContent = hashtag;
    });
  } catch (error) {
    console.error('오류 발생:', error);
  }
}
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
