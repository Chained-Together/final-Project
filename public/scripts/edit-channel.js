document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const channelNameElement = document.getElementById('channelName');
  const profileImageElement = document.getElementById('profile');
  const thumbnailsContainer = document.getElementById('thumbnailsContainer');
  const channelEditContainer = document.createElement('div');
  const arr = document.getElementById('err');
  // channelEditContainer.classList.add('channel-edit-container');
  if (thumbnailsContainer && thumbnailsContainer.parentNode) {
    thumbnailsContainer.parentNode.insertBefore(channelEditContainer, thumbnailsContainer);
  } else {
    console.error('thumbnailsContainer 또는 부모 노드를 찾을 수 없습니다.');
  }

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

    const videoResponse = await fetch(`/video/my/${channelData.id}`, {
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
    arr.style.display = 'block';
  }
});

const createVideoCard = (video, container, token) => {
  const card = document.createElement('div');
  card.classList.add('video-card', 'thumbnail');
  card.id = video.id;

  // 버튼 컨테이너 생성
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('button-container');

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

  // buttonContainer.appendChild(editBtn);
  buttonContainer.appendChild(deleteBtn);
  card.appendChild(buttonContainer);

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
    window.location.href = `/detail?videoId=${video.id}`;
  });

  container.appendChild(card);
};

function showPopup(thumbnail) {
  const modal = document.getElementById('editModal');
  const thumbnailInput = document.getElementById('thumbnailInput');
  const titleInput = document.getElementById('titleInput');
  const descriptionInput = document.getElementById('descriptionInput');
  const hashtagInput = document.getElementById('hashtagInput');
  const visibilityInput = document.getElementById('visibilityInput');

  // 팝업 데이터 초기화
  thumbnailInput.value = thumbnail.querySelector('img').src;
  titleInput.value = thumbnail.querySelector('h3').textContent;
  descriptionInput.value = thumbnail.querySelector('p').textContent;

  const hashtagContainer = thumbnail.querySelector('.hashtag-container');
  if (hashtagContainer) {
    const hashtags = Array.from(hashtagContainer.querySelectorAll('p')).map((tag) =>
      tag.textContent.trim(),
    );
    hashtagInput.value = hashtags.join(', ');
  } else {
    hashtagInput.value = '';
  }

  visibilityInput.value = thumbnail.dataset.visibility;

  // 팝업 열기
  modal.style.display = 'block';

  // 닫기 버튼 처리
  document.getElementById('closeModal').addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // 수정 버튼 처리
  document.getElementById('updateButton').addEventListener('click', async () => {
    try {
      thumbnail.querySelector('img').src = thumbnailInput.value;
      thumbnail.querySelector('h3').textContent = titleInput.value;
      thumbnail.querySelector('p').textContent = descriptionInput.value;

      if (hashtagContainer) {
        hashtagContainer.innerHTML = '';
        const newHashtags = hashtagInput.value.split(',').map((tag) => tag.trim());
        newHashtags.forEach((tag) => {
          const span = document.createElement('p');
          span.textContent = `#${tag}`;
          hashtagContainer.appendChild(span);
        });
      }

      thumbnail.dataset.visibility = visibilityInput.value;

      const videoId = thumbnail.id;
      const token = localStorage.getItem('token');
      const payload = {
        title: titleInput.value,
        description: descriptionInput.value,
        thumbnailUrl: thumbnailInput.value,
        hashtags: hashtagInput.value.split(',').map((tag) => tag.trim()),
        visibility: visibilityInput.value,
      };

      const response = await fetch(`/video/${videoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '수정 요청에 실패했습니다.');
      }

      alert('수정되었습니다!');
      modal.style.display = 'none';
    } catch (error) {
      console.error('수정 중 오류 발생:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  });
}
document.getElementById('editDoneBtn').addEventListener('click', () => {
  window.location.href = '/myChannel';
});

document.getElementById('accountEditBtn').addEventListener('click', () => {
  window.location.href = '/';
});

document.addEventListener('DOMContentLoaded', () => {
  const profileEditBtn = document.getElementById('profileEditBtn'); // 프로필 수정 버튼
  const profileEditModal = document.getElementById('profileEditModal'); // 모달
  const closeProfileEditModal = document.getElementById('closeProfileEditModal'); // 닫기 버튼
  const saveProfileEdit = document.getElementById('saveProfileEdit'); // 저장 버튼
  const profileImageInput = document.getElementById('profileImageInput'); // 이미지 입력
  const profileNameInput = document.getElementById('profileNameInput'); // 이름 입력
  const profileImageElement = document.getElementById('profile'); // 프로필 이미지 표시
  const channelNameElement = document.getElementById('channelName'); // 프로필 이름 표시

  profileEditBtn.addEventListener('click', () => {
    profileImageInput.value = profileImageElement.src;
    profileNameInput.value = channelNameElement.textContent;
    profileEditModal.style.display = 'block';
  });

  closeProfileEditModal.addEventListener('click', () => {
    profileEditModal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === profileEditModal) {
      profileEditModal.style.display = 'none';
    }
  });

  saveProfileEdit.addEventListener('click', async () => {
    try {
      profileImageElement.src = profileImageInput.value;
      channelNameElement.textContent = profileNameInput.value;

      const token = localStorage.getItem('token');
      const payload = {
        profileImage: profileImageInput.value,
        name: profileNameInput.value,
      };

      const response = await fetch('/channel', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '프로필 수정 요청에 실패했습니다.');
      }

      alert('프로필이 수정되었습니다!');
      profileEditModal.style.display = 'none';
    } catch (error) {
      console.error('프로필 수정 중 오류 발생:', error);
      alert('프로필 수정 중 오류가 발생했습니다.');
    }
  });
});
