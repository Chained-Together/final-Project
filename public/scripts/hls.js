(async () => {
  const video = document.getElementById('videoPlayer');

  try {
    const response = await fetch(`/video/${videoId}`, {
      method: 'Get',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if(!videoId){
      throw new Error('비디오 ID가 없습니다.')
    }
    if (!response.ok) {
      throw new Error('비디오를 로드하지 못했습니다.');
    }
    const { videoUrl: hlsUrl } = await response.json();
    console.log('HLS URL:', hlsUrl);

    // 브라우저 지원 여부에 따라 HLS.js 또는 기본 지원 사용
    if (Hls.isSupported()) {
      const hls = new Hls();

      // HLS URL 로드 및 비디오에 연결
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      // Manifest 파싱 완료 시 재생 시작
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest loaded. Starting playback...');
        video.play();
      });

      // 에러 핸들링
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS.js Error:', data);
        console.log(data.details);
        console.log('Fatal error:', data.fatal);
        const errorMsg = document.createElement('div');
        errorMsg.textContent = `HLS.js Error: ${data.details}`;
        errorMsg.style.color = 'red';
        document.body.appendChild(errorMsg);
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // 기본 HLS 지원을 사용하는 경우
      video.src = hlsUrl;
      video.addEventListener('loadedmetadata', () => {
        console.log('Native HLS support detected. Starting playback...');
        video.play();
      });
    } else {
      // HLS 지원되지 않는 경우 처리
      console.error('HLS.js는 이 브라우저에서 지원되지 않습니다.');
      const errorMsg = document.createElement('div');
      errorMsg.textContent = 'HLS.js는 이 브라우저에서 지원되지 않습니다.';
      errorMsg.style.color = 'red';
      document.body.appendChild(errorMsg);
    }
  } catch (err) {
  
  }
})();
