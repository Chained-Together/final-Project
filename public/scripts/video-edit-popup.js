export function showPopup(thumbnail) {
  // 팝업 오버레이 생성
  const overlay = document.createElement('div');
  overlay.className = 'popup-overlay';
  overlay.addEventListener('click', () => {
    popup.remove(); // 팝업 닫기
    overlay.remove(); // 오버레이 제거
  });

  // 팝업 컨테이너 생성
  const popup = document.createElement('div');
  popup.className = 'popup-container';

  // 닫기 버튼 생성
  const closeButton = document.createElement('button');
  closeButton.className = 'popup-close';
  closeButton.textContent = '닫기';
  closeButton.addEventListener('click', () => {
    popup.remove(); // 팝업 닫기
    overlay.remove(); // 오버레이 제거
  });

  const thumbnailLabel = document.createElement('label');
  thumbnailLabel.className = 'popup-label';
  thumbnailLabel.textContent = '썸네일 URL:';
  const thumbnailInput = document.createElement('input');
  thumbnailInput.className = 'popup-input';
  thumbnailInput.type = 'text';
  thumbnailInput.value = thumbnail.querySelector('img').src; // 기존 썸네일 URL 가져오기

  const titleLabel = document.createElement('label');
  titleLabel.className = 'popup-label';
  titleLabel.textContent = '영상 제목:';
  const titleInput = document.createElement('input');
  titleInput.className = 'popup-input';
  titleInput.type = 'text';
  titleInput.value = thumbnail.querySelector('h3').textContent; // 기존 제목 가져오기

  const descriptionLabel = document.createElement('label');
  descriptionLabel.className = 'popup-label';
  descriptionLabel.textContent = '영상 설명:';
  const descriptionInput = document.createElement('textarea');
  descriptionInput.className = 'popup-textarea';
  descriptionInput.value = thumbnail.querySelector('p').textContent; // 기존 설명 가져오기

  

  const saveButton = document.createElement('button');
  saveButton.className = 'popup-save-button';
  saveButton.textContent = '수정하기';
  saveButton.addEventListener('click', () => {
    thumbnail.querySelector('img').src = thumbnailInput.value;
    thumbnail.querySelector('h3').textContent = titleInput.value;
    thumbnail.querySelector('p').textContent = descriptionInput.value;

    alert('수정되었습니다!');
    popup.remove();
    overlay.remove();
  });

  popup.appendChild(closeButton);
  popup.appendChild(thumbnailLabel);
  popup.appendChild(thumbnailInput);
  popup.appendChild(titleLabel);
  popup.appendChild(titleInput);
  popup.appendChild(descriptionLabel);
  popup.appendChild(descriptionInput);
  popup.appendChild(saveButton);

  document.body.appendChild(overlay);
  document.body.appendChild(popup);
}
