document.addEventListener('DOMContentLoaded', async () => {
  const profileImage = document.querySelector('.profileImage'); // 채널 사진

  const waitForVideoData = () => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (globalVideoData && globalVideoData.channel) {
          clearInterval(interval); // 데이터가 준비되면 반복 중단
          resolve(globalVideoData);
        }
      }, 100); // 100ms 간격으로 확인
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
    const profileImageUrl = channel.profileImage || '/path/to/default-profile.png'; // 프로필 이미지

    profileImage.src = profileImageUrl;

    profileImage.addEventListener('click', () => {
      window.location.href = `/getChannel/${channelId}`;
    });
  } catch (error) {
    console.error('채널 데이터 로드 실패:', error.message);
  }
});
