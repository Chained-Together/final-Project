document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const videoResultsContainer = document.getElementById('videoResultsContainer');
  const channelResultsContainer = document.getElementById('channelResultsContainer');

  // 검색 이벤트 처리
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const keyword = searchInput.value.trim();
    if (!keyword) {
      alert('검색어를 입력해주세요.');
      return;
    }
    window.location.href = `/search?keyword=${encodeURIComponent(keyword)}`;
  });

  if (!videoResultsContainer || !channelResultsContainer) {
    console.error('필수 DOM 요소를 찾을 수 없습니다.');
    return;
  }

  // URL에서 검색어 추출
  const params = new URLSearchParams(window.location.search);
  const keyword = params.get('keyword');

  // 초기 데이터 로드
  if (keyword) {
    fetchVideos(keyword);
    fetchChannels(keyword);
  } else {
    videoResultsContainer.innerHTML = '<p>검색어를 입력해주세요.</p>';
    channelResultsContainer.innerHTML = '<p>검색어를 입력해주세요.</p>';
  }

  // 동영상 데이터를 가져오는 함수
  async function fetchVideos(keyword) {
    try {
      videoResultsContainer.innerHTML = '<p>동영상을 불러오는 중입니다...</p>';

      const response = await fetch(`/video/search/${encodeURIComponent(keyword)}`);
      if (!response.ok) {
        throw new Error(`비디오 검색 요청 실패 (상태 코드: ${response.status})`);
      }

      const data = await response.json();
      console.log('비디오 데이터:', data);

      renderVideoResults(data);
    } catch (error) {
      console.error('비디오 에러 발생:', error);
      videoResultsContainer.innerHTML = '<p>비디오 검색 결과를 불러오는 데 실패했습니다.</p>';
    }
  }

  // 채널 데이터를 가져오는 함수
  async function fetchChannels(keyword) {
    try {
      channelResultsContainer.innerHTML = '<p>채널을 불러오는 중입니다...</p>';

      const response = await fetch(`/channel/search/${encodeURIComponent(keyword)}`);
      if (!response.ok) {
        throw new Error(`채널 검색 요청 실패 (상태 코드: ${response.status})`);
      }

      const data = await response.json();
      console.log('채널 데이터:', data);

      renderChannelResults(data);
    } catch (error) {
      console.error('채널 에러 발생:', error);
      channelResultsContainer.innerHTML = '<p>채널 검색 결과를 불러오는 데 실패했습니다.</p>';
    }
  }

  // 동영상 결과 렌더링 함수
  function renderVideoResults(videos) {
    videoResultsContainer.innerHTML = ''; // 기존 결과 초기화

    if (!videos.length) {
      videoResultsContainer.innerHTML = '<p>비디오 검색 결과가 없습니다.</p>';
      return;
    }

    videos.forEach((video) => {
      const videoElement = document.createElement('div');
      videoElement.classList.add('video-item');
      videoElement.innerHTML = `
          <h3>${video.title}</h3>
          <img src="${video.thumbnailUrl}" alt="${video.title}" />
          <p>${video.hashtags}</p>
        `;
      videoResultsContainer.appendChild(videoElement);
    });
  }

  // 채널 결과 렌더링 함수
  function renderChannelResults(channels) {
    channelResultsContainer.innerHTML = '';
    if (!channels.length) {
      channelResultsContainer.innerHTML = '<p>채널 검색 결과가 없습니다.</p>';
      return;
    }
    console.log(channels);

    channels.forEach((channel) => {
      const channelElement = document.createElement('div');
      channelElement.classList.add('channel-item');
      channelElement.innerHTML = `
          <h3>${channel.name}</h3>
          <img src="${channel.profileImage}" alt="${channel.name}" />
        `;
      channelResultsContainer.appendChild(channelElement);
    });
    console.log('렌더링 후 컨테이너:', channelResultsContainer.innerHTML);
  }
});

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab-content').forEach((content) => {
      content.classList.remove('active');
    });

    const target = document.getElementById(`${tab.dataset.tab}Container`);
    console.log('활성화된 컨테이너:', target);
    target.classList.add('active');
  });
});
