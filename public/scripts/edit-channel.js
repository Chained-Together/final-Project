import { showPopup } from './video-edit-popup.js';

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const channelNameElement = document.getElementById('channelName');
  const profileImageElement = document.getElementById('profileImage');
  const thumbnailsContainer = document.getElementById('thumbnailsContainer');
  const channelEditContainer = document.createElement('div');
  channelEditContainer.classList.add('channel-edit-container');
  document.body.insertBefore(channelEditContainer, thumbnailsContainer);

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

    // 채널 수정 UI 생성
    createChannelEditUI(
      channelEditContainer,
      channelData,
      token,
      channelNameElement,
      profileImageElement,
    );

    // 비디오 로드
    const videoResponse = await fetch(`/video/edit/${channelData.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!videoResponse.ok) {
      throw new Error('비디오를 로드하지 못했습니다.');
    }

    const videoData = await videoResponse.json();
    thumbnailsContainer.innerHTML = '';
    videoData.forEach((video) => {
      createVideoCard(video, thumbnailsContainer, token);
    });
  } catch (error) {
    console.error('오류:', error);
    channelNameElement.textContent = '정보를 로드하는 중 오류가 발생했습니다.';
  }
});

const createChannelEditUI = (
  container,
  channelData,
  token,
  channelNameElement,
  profileImageElement,
) => {
  const channelTitleLabel = document.createElement('label');
  channelTitleLabel.textContent = '채널 제목:';
  container.appendChild(channelTitleLabel);

  const channelTitleInput = document.createElement('input');
  channelTitleInput.type = 'text';
  channelTitleInput.value = channelData.name || '';
  container.appendChild(channelTitleInput);

  const profileUrlLabel = document.createElement('label');
  profileUrlLabel.textContent = '프로필 URL:';
  container.appendChild(profileUrlLabel);

  const profileUrlInput = document.createElement('input');
  profileUrlInput.type = 'text';
  profileUrlInput.value = channelData.profileImage || '';
  container.appendChild(profileUrlInput);

  const saveButton = document.createElement('button');
  saveButton.textContent = '수정';
  container.appendChild(saveButton);

  saveButton.addEventListener('click', async () => {
    try {
      const payload = {
        name: channelTitleInput.value,
        profileImage: profileUrlInput.value,
      };

      const updateResponse = await fetch('/channel', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!updateResponse.ok) {
        throw new Error('채널 정보를 업데이트하지 못했습니다.');
      }

      alert('채널 정보가 성공적으로 업데이트되었습니다.');
      channelNameElement.textContent = payload.name;
      profileImageElement.src = payload.profileImage;
    } catch (error) {
      console.error('채널 수정 중 오류 발생:', error);
      alert('채널 정보를 수정하는 중 오류가 발생했습니다.');
    }
  });
};

const createVideoCard = (video, container, token) => {
  const card = document.createElement('div');
  card.classList.add('video-card', 'thumbnail');
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
  const span = document.createElement('p');
  span.textContent = String(video.hashtags);
  hashtagContainer.appendChild(span);

  const visibilityLabel = document.createElement('p');
  visibilityLabel.className = 'visibility-label';
  visibilityLabel.textContent = `Visibility: ${video.visibility}`;

  card.appendChild(img);
  card.appendChild(title);
  card.appendChild(description);
  card.appendChild(hashtagContainer);
  card.appendChild(visibilityLabel);

  card.addEventListener('click', () => {
    window.location.href = `/view-video?id=${video.id}`;
  });

  // 편집/삭제 버튼 추가
  const editBtn = document.createElement('button');
  editBtn.textContent = '편집';
  editBtn.classList.add('editBtn');
  editBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    showPopup(card);
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '삭제';
  deleteBtn.classList.add('deleteBtn');
  deleteBtn.addEventListener('click', async (event) => {
    event.stopPropagation();
    if (confirm('이 비디오를 삭제하시겠습니까?')) {
      const removeResponse = await fetch(`/video/${card.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!removeResponse.ok) {
        alert('비디오 삭제에 실패했습니다.');
        return;
      }

      card.remove();
    }
  });

  card.appendChild(editBtn);
  card.appendChild(deleteBtn);
  container.appendChild(card);
};

const profileButton = document.getElementById('profileButton');

profileButton.addEventListener('click', () => {
  let channelEditBtn = document.getElementById('channelEditBtn');

  if (!channelEditBtn) {
    channelEditBtn = createChannelEditButton();

    profileButton.parentElement.insertBefore(channelEditBtn, profileButton);
  } else {
    channelEditBtn.remove();
  }
});

const createChannelEditButton = () => {
  const channelEditButton = document.createElement('button');
  channelEditButton.textContent = '편집 완료';
  channelEditButton.id = 'channelEditBtn';
  channelEditButton.style.padding = '8px 12px';
  channelEditButton.style.backgroundColor = '#ffa600';
  channelEditButton.style.color = '#fff';
  channelEditButton.style.border = 'none';
  channelEditButton.style.borderRadius = '5px';
  channelEditButton.style.cursor = 'pointer';

  channelEditButton.addEventListener('click', () => {
    window.location.href = '/myChannel';
  });

  return channelEditButton;
};
