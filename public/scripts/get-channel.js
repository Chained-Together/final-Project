document.addEventListener('DOMContentLoaded', async () => {
  const urlPath = window.location.pathname;
  const segments = urlPath.split('/');
  const channelId = segments[segments.length - 1];
  const channelNameElement = document.getElementById('channelName');
  const profileImageElement = document.getElementById('profile');
  const thumbnailsContainer = document.getElementById('thumbnailsContainer');

  try {
    const response = await fetch(`/channel/${channelId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('채널 정보를 가져오지 못했습니다.');
    }

    const channelData = await response.json();

    channelNameElement.textContent = channelData.name || '알 수 없음';
    profileImageElement.src = channelData.profileImage || '/path/to/default-profile.png';

    const videoResponse = await fetch(`/video/channel/${channelData.id}`, {
      method: 'GET',
    });

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

        card.addEventListener('click', () => {
          window.location.href = `/detail?videoId=${video.id}`;
        });

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(hashtagContainer);
        thumbnailsContainer.appendChild(card);
      });
    }, 0);
  } catch (error) {
    console.error('오류:', error);
    channelNameElement.textContent = '정보를 로드하는 중 오류가 발생했습니다.';
  }
});
