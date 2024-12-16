async function playVideo(videoId) {
    const token = localStorage.getItem('token') || null;
    const video = document.getElementById('videoPlayer');
    const thumbnailsContainer = document.getElementById('thumbnailsContainer');
    // 비디오 데이터 가져오기
    const response = await fetch(`/video/${videoId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('비디오를 로드하지 못했습니다.');
    }
  
    const videoData = await response.json();
    if (videoData?.message) {
      throw new Error(videoData.message);
    }
  
    globalVideoData = videoData;
    console.log('videoData',videoData);

    // DOM 요소 가져오기
    const titleElement = document.querySelector(".title-box h3");
    const contentElement = document.querySelector(".title-box span");

    // 데이터에서 제목과 설명 추출
    const { foundVideo } = videoData;

    // 제목과 내용 업데이트
    if (titleElement && foundVideo.title) {
    titleElement.textContent = foundVideo.title;
    } else {
    console.error("Title element or video title is missing");
    }

    if (contentElement && foundVideo.description) {
    contentElement.textContent = foundVideo.description;
    } else {
    console.error("Content element or video description is missing");
    }
    
  
    // HLS.js를 사용해 비디오 재생
    const hlsUrl = videoData?.videoUrl;
    if (!hlsUrl) {
      throw new Error('비디오 URL이 없습니다.');
    }
  
    if (Hls.isSupported()) {
      // HLS.js 사용
      const hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(video); // 기존 video 요소에 연결
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play(); // 비디오가 준비되면 자동 재생
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS.js Error:', data);
        const errorMsg = document.createElement('div');
        errorMsg.textContent = `HLS.js Error: ${data.details}`;
        errorMsg.style.color = 'red';
        thumbnailsContainer.appendChild(errorMsg);
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari와 같은 네이티브 HLS 지원 브라우저에서 바로 재생
      video.src = hlsUrl;
      video.autoplay = true; // autoplay 속성 추가
      video.controls = true; // 사용자 컨트롤 제공
      video.addEventListener('loadedmetadata', () => {
        video.play(); // 비디오가 준비되면 자동 재생
      });
    } else {
      console.error('HLS.js는 이 브라우저에서 지원되지 않습니다.');
      const errorMsg = document.createElement('div');
      errorMsg.textContent = 'HLS.js는 이 브라우저에서 지원되지 않습니다.';
      errorMsg.style.color = 'red';
      thumbnailsContainer.appendChild(errorMsg);
    }
  }




// 좋아요 버튼과 카운트 표시 영역 가져오기
  const likeBtn = document.getElementById('detail-like-btn');
  const likeCount = document.getElementById('like-count');

  // URL에서 videoId 추출
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get('videoId');


  playVideo(videoId)

  // 초기 좋아요 수를 가져와 업데이트
  const updateLikeCount = async () => {
    try {
      const response = await fetch(`/likes/${videoId}`);
      if (!response.ok) throw new Error('좋아요 수를 가져오는 데 실패했습니다.');

      const data = await response.json();
      likeCount.textContent = data; // 서버 응답에 맞게 좋아요 수 업데이트
    } catch (error) {
      console.error('좋아요 수 오류:', error);
      likeCount.textContent = '오류';
    }
  };



// 좋아요 상태 변경
const toggleLike = async () => {
    try {
      // 로컬스토리지에서 토큰 가져오기
      const token = localStorage.getItem('token');
      if (!token) throw new Error('토큰이 존재하지 않습니다.');
  
      const response = await fetch(`/likes/${videoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // 토큰 추가
        },
      });
  
      if (!response.ok) throw new Error('좋아요 상태를 변경하는 데 실패했습니다.');
  
      // 좋아요 상태 변경 후 다시 좋아요 수를 업데이트
      await updateLikeCount();
    } catch (error) {
      alert(`좋아요 오류: ${error.message}`);
    }
  };
  
  // 좋아요 버튼 클릭 이벤트
  likeBtn.addEventListener('click', toggleLike);
  
  // 초기화: 좋아요 수 업데이트
  if (videoId) {
    updateLikeCount();
  } else {
    console.error('URL에 videoId 파라미터가 없습니다.');
  }
  

