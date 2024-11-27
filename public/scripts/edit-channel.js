import { showPopup } from './video-edit-popup.js';

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const channelNameElement = document.getElementById('channelName');
  const profileImageElement = document.getElementById('profileImage');
  const thumbnailsContainer = document.getElementById('thumbnailsContainer');
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

    const videoResponse = await fetch(`/video/edit/${channelData.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(channelData.id);

    if (!videoResponse.ok) {
      throw new Error('비디오를 로드하지 못했습니다.');
    }
    const videoData = await videoResponse.json();
    console.log('비디오 데이터:', videoData);

    thumbnailsContainer.innerHTML = '';

    videoData.forEach(() => {
      const placeholder = document.createElement('div');
      placeholder.classList.add('placeholder-card');

      const placeholderVideo = document.createElement('div');
      placeholderVideo.classList.add('placeholder', 'placeholder-video');

      const placeholderTitle = document.createElement('div');
      placeholderTitle.classList.add('placeholder', 'placeholder-title');

      placeholder.appendChild(placeholderVideo);
      placeholder.appendChild(placeholderTitle);

      thumbnailsContainer.appendChild(placeholder);
    });

    setTimeout(() => {
      thumbnailsContainer.innerHTML = '';

      videoData.forEach((video) => {
        const card = document.createElement('div');
        card.classList.add('video-card', 'thumbnail'); // "thumbnail" 클래스 추가
        card.id = video.id;

        const img = document.createElement('img');
        img.src = video.thumbnailUrl;
        img.alt = video.title;

        const title = document.createElement('h3');
        title.textContent = video.title;

        const description = document.createElement('p');
        description.textContent = video.description;

        const hashtagContainer = document.createElement('div');
        hashtagContainer.classList.add('hashtag-container');
        hashtagContainer.style = `
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    `;

        if (Array.isArray(video.hashtags)) {
          video.hashtags.forEach((tag) => {
            const hashtag = document.createElement('span');
            hashtag.classList.add('hashtag');
            hashtag.textContent = `#${tag}`;
            hashtag.style = `
          background-color: #f0f0f0;
          color: #333;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 12px;
        `;
            hashtagContainer.appendChild(hashtag);
          });
        }

        card.addEventListener('click', () => {
          window.location.href = `/view-video?id=${video.id}`;
        });

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(hashtagContainer);
        thumbnailsContainer.appendChild(card);
        addEditDeleteButtons();
      });
    }, 0);
  } catch (error) {
    console.error('오류:', error);
    channelNameElement.textContent = '정보를 로드하는 중 오류가 발생했습니다.';
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

const profileButton = document.getElementById('profileButton');

const createChannelEditButton = () => {
  const channelEditButton = document.createElement('button');
  channelEditButton.textContent = '편집 완료';
  channelEditButton.id = 'channelEditBtn';
  channelEditButton.style = `
      position: absolute;
      top: 30px; /* 계정 버튼 아래로 배치 */
      right: 100px;
      background-color: #fff;
      color: #000;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      z-index: 1000;
    `;

  channelEditButton.addEventListener('click', () => {
    window.location.href = '/myChannel';
  });

  return channelEditButton;
};

const addEditDeleteButtons = () => {
  const token = localStorage.getItem('token');
  const thumbnails = document.querySelectorAll('.thumbnail');
  thumbnails.forEach((thumbnail) => {
    if (thumbnail.querySelector('.editBtn') || thumbnail.querySelector('.deleteBtn')) return;

    const editBtn = document.createElement('button');
    editBtn.textContent = '편집';
    editBtn.className = 'editBtn';
    editBtn.style = `
      position: absolute;
      top: 215px;
      right: 10px;
      background-color: #007bff;
      color: #fff;
      border: none;
      padding: 5px 10px;
      border-radius: 5px;
      cursor: pointer;
      z-index: 10;
    `;
    editBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      alert('편집 모드로 전환합니다.');
      showPopup(thumbnail);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '삭제';
    deleteBtn.className = 'deleteBtn';
    deleteBtn.style = `
      position: absolute;
      top: 185px;
      right: 10px;
      background-color: #dc3545;
      color: #fff;
      border: none;
      padding: 5px 10px;
      border-radius: 5px;
      cursor: pointer;
      z-index: 10;
    `;
    deleteBtn.addEventListener('click', async (event) => {
      event.stopPropagation();
      console.log('Thumbnail ID:', thumbnail.id);
      if (confirm('이 비디오를 삭제하시겠습니까?')) {
        const removeResponse = await fetch(`/video/${thumbnail.id}`, {
          method: 'Delete',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!removeResponse.ok) {
          alert('비디오 삭제에 실패했습니다.');
          return;
        }

        thumbnail.remove();
      }
    });

    thumbnail.style.position = 'relative';
    thumbnail.appendChild(editBtn);
    thumbnail.appendChild(deleteBtn);
  });
};

const removeEditDeleteButtons = () => {
  const editButtons = document.querySelectorAll('.editBtn');
  const deleteButtons = document.querySelectorAll('.deleteBtn');
  editButtons.forEach((btn) => btn.remove());
  deleteButtons.forEach((btn) => btn.remove());
};

profileButton.addEventListener('click', () => {
  let channelEditBtn = document.getElementById('channelEditBtn');
  if (!channelEditBtn) {
    channelEditBtn = createChannelEditButton();
    document.body.appendChild(channelEditBtn);
  } else {
    channelEditBtn.remove();
  }
});