export function showPopup(thumbnail) {
  const overlay = document.createElement('div');
  overlay.className = 'popup-overlay';
  overlay.addEventListener('click', () => {
    popup.remove();
    overlay.remove();
  });

  const popup = document.createElement('div');
  popup.className = 'popup-container';

  const closeButton = document.createElement('button');
  closeButton.className = 'popup-close';
  closeButton.textContent = '닫기';
  closeButton.addEventListener('click', () => {
    popup.remove();
    overlay.remove();
  });

  // 썸네일 URL
  const thumbnailLabel = document.createElement('label');
  thumbnailLabel.className = 'popup-label';
  thumbnailLabel.textContent = '썸네일 URL:';
  const thumbnailInput = document.createElement('input');
  thumbnailInput.className = 'popup-input';
  thumbnailInput.type = 'text';
  thumbnailInput.value = thumbnail.querySelector('img').src;

  // 제목
  const titleLabel = document.createElement('label');
  titleLabel.className = 'popup-label';
  titleLabel.textContent = '영상 제목:';
  const titleInput = document.createElement('input');
  titleInput.className = 'popup-input';
  titleInput.type = 'text';
  titleInput.value = thumbnail.querySelector('h3').textContent;

  // 설명
  const descriptionLabel = document.createElement('label');
  descriptionLabel.className = 'popup-label';
  descriptionLabel.textContent = '영상 설명:';
  const descriptionInput = document.createElement('textarea');
  descriptionInput.className = 'popup-textarea';
  descriptionInput.value = thumbnail.querySelector('p').textContent;

  // 해시태그
  const hashtagLabel = document.createElement('label');
  hashtagLabel.className = 'popup-label';
  hashtagLabel.textContent = '해시태그:';
  const hashtagInput = document.createElement('input');
  hashtagInput.className = 'popup-input';
  hashtagInput.type = 'text';

  const hashtagContainer = thumbnail.querySelector('.hashtag-container');
  if (hashtagContainer) {
    const hashtags = Array.from(hashtagContainer.querySelectorAll('p')).map((tag) =>
      tag.textContent.trim(),
    );
    hashtagInput.value = hashtags.join(', ');
  } else {
    hashtagInput.value = '';
  }

  // 공개 여부
  const visibilityLabel = document.createElement('label');
  visibilityLabel.className = 'popup-label';
  visibilityLabel.textContent = '공개 여부:';
  const visibilityInput = document.createElement('select');
  visibilityInput.className = 'popup-input';
  ['public', 'private', 'unlisted'].forEach((option) => {
    const opt = document.createElement('option');
    opt.value = option;
    opt.textContent = option;
    if (thumbnail.dataset.visibility === option) {
      opt.selected = true;
    }
    visibilityInput.appendChild(opt);
  });

  // 수정 버튼
  const updateButton = document.createElement('button');
  updateButton.className = 'popup-save-button';
  updateButton.textContent = '수정하기';

  updateButton.addEventListener('click', async () => {
    try {
      // 업데이트: 썸네일, 제목, 설명
      thumbnail.querySelector('img').src = thumbnailInput.value;
      thumbnail.querySelector('h3').textContent = titleInput.value;
      thumbnail.querySelector('p').textContent = descriptionInput.value;

      // 업데이트: 해시태그
      if (hashtagContainer) {
        hashtagContainer.innerHTML = ''; // 기존 해시태그 초기화
        const newHashtags = hashtagInput.value.split(',').map((tag) => tag.trim());
        newHashtags.forEach((tag) => {
          const span = document.createElement('p');
          span.textContent = `#${tag}`;
          hashtagContainer.appendChild(span);
        });
      }

      // 업데이트: 공개 여부
      thumbnail.dataset.visibility = visibilityInput.value;

      // REST API 호출
      const videoId = thumbnail.id;
      const token = localStorage.getItem('token');
      const payload = {
        title: titleInput.value,
        description: descriptionInput.value,
        thumbnailUrl: thumbnailInput.value,
        hashtags: hashtagInput.value.split(',').map((tag) => tag.trim()),
        visibility: visibilityInput.value,
      };

      console.log(payload);

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
      popup.remove();
      overlay.remove();
    } catch (error) {
      console.error('수정 중 오류 발생:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  });

  // 팝업 구성 요소 추가
  popup.appendChild(closeButton);
  popup.appendChild(thumbnailLabel);
  popup.appendChild(thumbnailInput);
  popup.appendChild(titleLabel);
  popup.appendChild(titleInput);
  popup.appendChild(descriptionLabel);
  popup.appendChild(descriptionInput);
  popup.appendChild(hashtagLabel);
  popup.appendChild(hashtagInput);
  popup.appendChild(visibilityLabel);
  popup.appendChild(visibilityInput);
  popup.appendChild(updateButton);

  document.body.appendChild(overlay);
  document.body.appendChild(popup);
}
