document.addEventListener('DOMContentLoaded', async () => {
  const channelNameElement = document.getElementById('channelName');
  const profileImageElement = document.getElementById('profile');
  const thumbnailsContainer = document.getElementById('thumbnailsContainer');
  const liveButton = document.getElementById('liveVideo');
  const uploadBtn = document.getElementById('uploadBtn');
  const chatBtn = document.getElementById('chatBtn');

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
        card.classList.add('video-card', 'thumbnail'); // "thumbnail" 클래스 추가
        card.id = video.id;

        const imgContainer = document.createElement('div'); // img를 감싸는 div 추가
        imgContainer.classList.add('img-container');

        const img = document.createElement('img');
        img.src = video.thumbnailUrl;
        img.alt = video.title;

        const titleContainer = document.createElement('div'); // title을 감싸는 div 추가
        titleContainer.classList.add('title-container');

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

        imgContainer.appendChild(img); // img 추가
        titleContainer.appendChild(title); // h3를 감싼 div에 추가
        card.appendChild(imgContainer); // img를 감싼 div 추가
        card.appendChild(titleContainer); // title을 감싼 div 추가
        card.appendChild(description);
        card.appendChild(hashtagContainer);
        thumbnailsContainer.appendChild(card);
      });
    }, 0);
  } catch (error) {
    console.error('오류:', error);
    channelNameElement.textContent = '정보를 로드하는 중 오류가 발생했습니다.';
  }

  uploadBtn.addEventListener('click', () => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = '/upload';
    } else {
      window.location.href = '/login';
    }
  });

  liveButton.addEventListener('click', () => {
    window.location.href = '/liveVideo';
  });

  const editBtn = document.getElementById('editBtn');

  editBtn.addEventListener('click', () => {
    window.location.href = '/edit-mychannel';
  });

  chatBtn.addEventListener('click', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId') || '<%= roomId %>';

    const response = await fetch(`/chat/${roomId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const html = await response.text();
      document.open();
      document.write(html);
      document.close();
    } else {
      console.error('접속 권한이 없습니다.');
    }
  });
});
