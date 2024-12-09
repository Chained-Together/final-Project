document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const videoResultsContainer = document.getElementById('videoResultsContainer');
  const channelResultsContainer = document.getElementById('channelResultsContainer');

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

  const params = new URLSearchParams(window.location.search);
  const keyword = params.get('keyword');

  if (keyword) {
    fetchVideos(keyword);
    fetchChannels(keyword);
  } else {
    videoResultsContainer.innerHTML = '<p>검색어를 입력해주세요.</p>';
    channelResultsContainer.innerHTML = '<p>검색어를 입력해주세요.</p>';
  }

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

  function renderVideoResults(videos) {
    videoResultsContainer.innerHTML = ''; // 기존 결과 초기화

    if (!videos.length) {
      videoResultsContainer.innerHTML = '<p>비디오 검색 결과가 없습니다.</p>';
      return;
    }

    videos.forEach((video) => {
      createVideoElement(video);
    });
  }

  function createVideoElement(video) {
    if (!video || (!video.thumbnailUrl && !video.title)) {
      console.warn('유효하지 않은 비디오 데이터:', video);
      return null;
    }

    const videoCard = document.createElement('div');
    videoCard.className = 'video-card';
    videoCard.addEventListener('click', () => {
      window.location.href = `/view-video?id=${video.id}`;
    });

    if (video.thumbnailUrl) {
      const thumbnail = document.createElement('img');
      thumbnail.className = 'video-thumbnail';
      thumbnail.src = video.thumbnailUrl;
      thumbnail.alt = video.title || 'Video Thumbnail';
      videoCard.appendChild(thumbnail);
    }

    if (video.description) {
      const description = document.createElement('p');
      description.className = 'video-description';
      description.textContent = video.description;
      videoCard.appendChild(description);
    }

    if (video.hashtags && Array.isArray(video.hashtags)) {
      const hashtagContainer = document.createElement('div');
      hashtagContainer.className = 'video-hashtags';

      video.hashtags.forEach((tag) => {
        const hashtag = document.createElement('span');
        hashtag.className = 'hashtag';
        hashtag.textContent = `#${tag.trim()}`; // 태그 앞에 # 추가
        hashtagContainer.appendChild(hashtag);
      });

      videoCard.appendChild(hashtagContainer);
    }

    videoResultsContainer.appendChild(videoCard);
  }

  function renderChannelResults(channels) {
    channelResultsContainer.innerHTML = '';
    if (!channels.length) {
      channelResultsContainer.innerHTML = '<p>채널 검색 결과가 없습니다.</p>'; // 검색 결과가 없을 때 메시지 표시
      return;
    }
    console.log(channels);

    channels.forEach((channel) => {
      const channelElement = document.createElement('div');
      channelElement.classList.add('channel-item');
      channelElement.innerHTML = `
        <div class="channel-card">
          <img src="${channel.profileImage}" alt="${channel.name}" />
          <h3>${channel.name}</h3>
        
        </div>
        
      `;

      channelElement.addEventListener('click', () => {
        if (channel.id) {
          window.location.href = `/getChannel/${channel.id}`;
        } else {
          alert('해당 채널로 이동할 수 없습니다. URL이 없습니다.');
        }
      });

      channelResultsContainer.appendChild(channelElement); // 컨테이너에 카드 추가
    });

    console.log('렌더링 후 컨테이너:', channelResultsContainer.innerHTML);
  }
});

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));

    document
      .querySelectorAll('.tab-content')
      .forEach((content) => content.classList.remove('active'));
    tab.classList.add('active');

    const target = document.getElementById(`${tab.dataset.tab}Container`);
    if (target) {
      target.classList.add('active');
    }
  });
});
