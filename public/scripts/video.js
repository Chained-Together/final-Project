document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get('id');

  if (!videoId) {
    console.error('비디오 ID가 없습니다.');
    return;
  }

  try {
    const videoResponse = await fetch(`/video/${videoId}`, {
      method: 'GET',
    });

    if (!videoResponse.ok) {
      throw new Error('비디오를 로드하지 못했습니다.');
    }

    const videoData = await videoResponse.json();
    console.log('비디오 데이터:', videoData);

    // thumbnailsContainer 초기화
    thumbnailsContainer.innerHTML = '';

    // 비디오 요소 생성
    const videoElement = document.createElement('video');
    videoElement.setAttribute('controls', true);
    videoElement.setAttribute('autoplay', true);
    videoElement.setAttribute('width', '800');
    videoElement.style.borderRadius = '10px';
    videoElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    videoElement.style.margin = '20px';

    // 비디오 소스 설정
    const highResolutionUrl = videoData?.resolution?.high || '/path/to/default-video.mp4';
    const sourceElement = document.createElement('source');
    sourceElement.setAttribute('src', highResolutionUrl);
    sourceElement.setAttribute('type', 'video/mp4');

    videoElement.appendChild(sourceElement);
    console.log('비디오 소스 URL:', highResolutionUrl);

    // 비디오 제목 생성
    const titleElement = document.createElement('h3');
    titleElement.textContent = videoData?.title || '제목 없음';
    titleElement.style.textAlign = 'center';
    titleElement.style.marginTop = '10px';

    // 비디오 설명 생성
    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = videoData?.description || '설명이 없습니다.';
    descriptionElement.style.textAlign = 'center';
    descriptionElement.style.color = '#555';

    // 스타일 설정 및 요소 추가
    thumbnailsContainer.style.display = 'flex';
    thumbnailsContainer.style.flexDirection = 'column';
    thumbnailsContainer.style.alignItems = 'center';
    thumbnailsContainer.style.padding = '20px';

    thumbnailsContainer.appendChild(videoElement);
    thumbnailsContainer.appendChild(titleElement);
    thumbnailsContainer.appendChild(descriptionElement);
  } catch (error) {
    console.error('오류:', error);
    thumbnailsContainer.innerHTML = '<p>비디오를 로드하는 중 오류가 발생했습니다.</p>';
  }
});

// const profileButton = document.getElementById('profileButton');
// profileButton.addEventListener('click', () => {
//   window.location.href = '/mychannel';
// });
