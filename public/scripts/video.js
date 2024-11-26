document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get('id');
  const token = localStorage.getItem('token') || null;
  const thumbnailsContainer = document.getElementById('thumbnailsContainer'); // 컨테이너 선택

  if (!videoId) {
    console.error('비디오 ID가 없습니다.');
    return;
  }

  try {
    const videoResponse = await fetch(`/video/${videoId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!videoResponse.ok) {
      throw new Error('비디오를 로드하지 못했습니다.');
    }

    const videoData = await videoResponse.json();
    if (videoData?.message) {
      throw new Error(videoData.message);
    }

    // 비디오와 버튼 렌더링
    thumbnailsContainer.innerHTML = ''; // 기존 컨텐츠 초기화

    // 비디오 요소 생성
    const videoElement = document.createElement('video');
    videoElement.setAttribute('controls', true);
    videoElement.setAttribute('autoplay', true);
    videoElement.setAttribute('width', '800');
    videoElement.style.borderRadius = '10px';
    videoElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    videoElement.style.margin = '20px';

    const highResolutionUrl = videoData?.resolution?.high || '/path/to/default-video.mp4';
    const sourceElement = document.createElement('source');
    sourceElement.setAttribute('src', highResolutionUrl);
    sourceElement.setAttribute('type', 'video/mp4');

    videoElement.appendChild(sourceElement);
    console.log('비디오 소스 URL:', highResolutionUrl);

    // 제목 생성
    const titleElement = document.createElement('h3');
    titleElement.textContent = videoData?.title || '제목 없음';
    titleElement.style.textAlign = 'center';
    titleElement.style.marginTop = '10px';

    // 설명 생성
    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = videoData?.description || '설명이 없습니다.';
    descriptionElement.style.textAlign = 'center';
    descriptionElement.style.color = '#555';

    // 비디오 및 텍스트 추가
    thumbnailsContainer.style.display = 'flex';
    thumbnailsContainer.style.flexDirection = 'column';
    thumbnailsContainer.style.alignItems = 'center';
    thumbnailsContainer.style.padding = '20px';

    thumbnailsContainer.appendChild(videoElement);
    thumbnailsContainer.appendChild(titleElement);
    thumbnailsContainer.appendChild(descriptionElement);

    // 버튼 생성 조건
    if (videoData?.visibility !== 'private') {
      let linkBtn = document.getElementById('linkBtn');
      if (!linkBtn) {
        linkBtn = document.createElement('button');
        linkBtn.id = 'linkBtn';
        linkBtn.textContent = '링크 공유';
        linkBtn.style = `
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        `;

        // 버튼 클릭 이벤트
        linkBtn.addEventListener('click', async () => {
          try {
            const response = await fetch(`/video/link/${videoId}`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (!response.ok) {
              throw new Error('링크를 가져오는데 실패했습니다.');
            }

            const { url } = await response.json();
            await navigator.clipboard.writeText(url);
            alert('링크가 클립보드에 복사되었습니다!');
          } catch (error) {
            alert(`오류 발생: ${error.message}`);
          }
        });

        // 버튼 추가
        thumbnailsContainer.appendChild(linkBtn);
      }
    }
  } catch (error) {
    console.error('오류:', error);
    thumbnailsContainer.innerHTML = `<p>${error.message}</p>`;
  }
});
