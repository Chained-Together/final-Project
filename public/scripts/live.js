document.addEventListener('DOMContentLoaded', async () => {
  const liveList = document.getElementById('liveList');
  const token = localStorage.getItem('token');

  try {
    const response = await fetch('/liveStreaming/list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response);

    if (!response.ok) {
      throw new Error('라이브 목록을 불러오는데 실패했습니다.');
    }

    const lives = await response.json();
    console.log('라이브 목록:', lives);

    lives.forEach((live) => {
      const liveItem = document.createElement('div');
      liveItem.className = 'live-item';
      liveItem.innerHTML = `
                <img src="${live.thumbnailUrl || '/public/images/default-thumbnail.png'}" 
                     alt="${live.title}" 
                     class="live-thumbnail">
                <div class="live-info">
                    <span class="live-badge">LIVE</span>
                    <h3 class="live-title">${live.title}</h3>
                    <p class="live-channel">${live.channelName || '알 수 없는 채널'}</p>
                </div>
            `;

      liveItem.addEventListener('click', () => {
        window.location.href = `/live/watch/${live.id}`;
      });

      liveList.appendChild(liveItem);
    });

    if (lives.length === 0) {
      liveList.innerHTML = '<p style="color: #fff;">현재 진행중인 방송이 없습니다.</p>';
    }
  } catch (error) {
    console.error('Error:', error);
    liveList.innerHTML = '<p style="color: #fff;">라이브 방송을 불러오는데 실패했습니다.</p>';
  }
});
