document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('qualityToggleBtn');
  const optionsContainer = document.getElementById('qualityOptions');

  const waitForVideoData = () => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (globalVideoData && globalVideoData.resolution) {
          clearInterval(interval);
          resolve(globalVideoData);
        }
      }, 100);
      setTimeout(() => {
        clearInterval(interval);
        reject(new Error('비디오 데이터 로드 대기 시간 초과.'));
      }, 5000);
    });
  };

  waitForVideoData()
    .then((videoData) => {
      console.log('비디오 데이터가 로드되었습니다:', videoData);

      const videoElement = document.querySelector('video');
      if (!videoElement) {
        console.error('비디오 요소를 찾을 수 없습니다.');
        return;
      }

      toggleButton.addEventListener('click', () => {
        optionsContainer.classList.toggle('show');
      });

      optionsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('qualityOptionBtn')) {
          const selectedQuality = event.target.getAttribute('data-quality');

          const newSourceUrl =
            selectedQuality === '720p' ? videoData.resolution.high : videoData.resolution.low;

          if (!newSourceUrl) {
            alert(`${selectedQuality} 화질의 URL이 없습니다.`);
            return;
          }

          const sourceElement = videoElement.querySelector('source');
          if (!sourceElement) {
            console.error('비디오 소스 요소를 찾을 수 없습니다.');
            return;
          }

          sourceElement.setAttribute('src', newSourceUrl);
          videoElement.load();
          videoElement.play();

          alert(`${selectedQuality} 화질로 전환되었습니다.`);
        }
      });

      document.addEventListener('click', (event) => {
        if (!event.target.closest('#qualityContainer')) {
          optionsContainer.classList.remove('show');
        }
      });
    })
    .catch((error) => {
      console.error('비디오 데이터 로드 실패:', error.message);
    });
});
