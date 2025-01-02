document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const profileImageElements = document.querySelectorAll('.profileImage');

  let isFetching = false; // 중복 요청 방지 플래그
  let lastVideoId = null; // 마지막 데이터의 id

  // 서버에서 비디오 데이터 가져오기
  async function fetchVideos(lastId) {
    const url = lastId ? `video/many/${take}` : 'video/many/50';
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      throw new Error('데이터를 가져오지 못했습니다.');
    }

    return response.json();
  }

  // 비디오 데이터를 템플릿으로 생성
  function createVideoElement(video) {
    console.log('video', video);

    if (!video) {
      console.warn('유효하지 않은 비디오 데이터:', video);
      return null;
    }

    const shortFormItem = document.createElement('div');
    shortFormItem.className = 'video-card';
    console.log(shortFormItem);

    shortFormItem.addEventListener('click', () => {
      window.location.href = `/detail?videoId=${video.videoId}`;
    });

    if (video.thumbnailUrl) {
      const placeholderVideo = document.createElement('div');
      placeholderVideo.className = 'video-card';
      placeholderVideo.style.backgroundImage = `url('${video.thumbnailUrl}')`;
      shortFormItem.appendChild(placeholderVideo);
    }

    if (video.title) {
      const placeholderTitle = document.createElement('p');
      placeholderTitle.className = 'placeholder-title';
      placeholderTitle.textContent = video.title;
      shortFormItem.appendChild(placeholderTitle);
    }

    return shortFormItem;
  }

  // 비디오 데이터를 추가 렌더링
  function appendVideos(container, videos) {
    videos.forEach((video) => {
      const videoElement = createVideoElement(video);
      if (videoElement) {
        $('.container').append(videoElement);
      }
    });
  }

  // 초기 로드 및 스크롤 처리
  async function initialize() {
    const shortFormGrid = document.getElementById('videoBox');

    try {
      // 초기 데이터 로드
      const initialVideos = await fetchVideos();
      appendVideos(shortFormGrid, initialVideos);

      // 마지막 비디오 ID 저장
      if (initialVideos.length > 0) {
        lastVideoId = initialVideos[initialVideos.length - 1].id;
      }
    } catch (error) {
      console.error('초기 데이터 로드 중 오류 발생:', error);
    }
  }

  // 초기 실행
  initialize();
});
