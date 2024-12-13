document.addEventListener('DOMContentLoaded', async () => {
  const profileImage = document.querySelector('.profileImage');

  const waitForVideoData = () => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (globalVideoData && globalVideoData.channel) {
          clearInterval(interval);
          resolve(globalVideoData);
        }
      }, 100);
      setTimeout(() => {
        clearInterval(interval);
        reject(new Error('globalVideoData 로드 대기 시간 초과.'));
      }, 5000);
    });
  };

  try {
    const videoData = await waitForVideoData();
    const { channel } = videoData;
    const channelId = channel.id;
    const profileImageUrl = channel.profileImage || '/path/to/default-profile.png';

    profileImage.src = profileImageUrl;

    profileImage.addEventListener('click', () => {
      window.location.href = `/getChannel/${channelId}`;
    });
  } catch (error) {
    console.error('채널 데이터 로드 실패:', error.message);
  }
});
