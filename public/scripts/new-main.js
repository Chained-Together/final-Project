let globalVideoData = null;
let lastVideoId = null;

//lastId의 이후 6개의 비디오를 로드함함
async function fetchVideos(take) {
  const url = take ? `video/many/${take}` : 'video/many/50';
  const response = await fetch(url, { method: 'GET' });

  if (!response.ok) {
    throw new Error('데이터를 가져오지 못했습니다.');
  }

  return response.json();
}

//비디오 id를 인자로 넣의면 해당 id의 비디오를 플레이 해줌
async function playVideo(url) {
  const token = localStorage.getItem('token') || null;
  const video = document.getElementById('videoPlayer');
  const thumbnailsContainer = document.getElementById('thumbnailsContainer');

  // HLS.js를 사용해 비디오 재생
  const hlsUrl = url;
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

const likeBtn = document.getElementById('like-btn');
const commentBtn = document.getElementById('comment-btn');

function goDetail(videoId) {
  // 기존 이벤트 제거
  const newHandler = function () {
    if (videoId) {
      window.location.href = `/detail?videoId=${videoId}`;
    } else {
      console.error('Video ID not found');
    }
  };

  // 기존 리스너 제거 후 새로운 리스너 등록
  likeBtn.removeEventListener('click', newHandler);
  commentBtn.removeEventListener('click', newHandler);
  likeBtn.addEventListener('click', newHandler);
  commentBtn.addEventListener('click', newHandler);
}

let videoIdsIndex = 0;

/**초기 로드에 비디오를 가져와서 재생한다 */
document.addEventListener('DOMContentLoaded', async () => {
  videoIdsIndex = 0;
  console.log('초기', videoIdsIndex);

  const videoData = await fetchVideos();
  console.log('videoData', videoData);

  document.getElementById('videoTitle').innerHTML = videoData[videoIdsIndex].title;
  playVideo(videoData[videoIdsIndex].videoUrl);
  goDetail(videoData[videoIdsIndex].videoId);

  /** 다음 버튼을 누르면 videoIds의 다음 index번호를 다음 영상이 재생된다 */
  const nextButton = document.getElementById('nextButton');
  nextButton.addEventListener('click', async () => {
    if (videoIdsIndex === videoData.length - 1) {
      videoIdsIndex = videoData.length - 1;

      errBox.style.display = 'block';
      setTimeout(() => {
        errBox.style.display = 'none';
      }, 2000);

      return; // 함수 실행 중단
    }

    videoIdsIndex++;

    if (videoData && videoData[videoIdsIndex] !== undefined) {
      playVideo(videoData[videoIdsIndex].videoUrl);
    }

    document.getElementById('videoTitle').innerHTML = videoData[videoIdsIndex].title;
    goDetail(videoData[videoIdsIndex].videoId);
  });

  /**이전 버튼을 누르면 videoIds의 다음 index번호를 이전전 영상이 재생된다 */
  const errBox = document.querySelector('.err-box');
  const prevButton = document.getElementById('prevButton');
  prevButton.addEventListener('click', async () => {
    videoIdsIndex--;

    if (videoData && videoData[videoIdsIndex] !== undefined) {
      playVideo(videoData[videoIdsIndex].videoUrl);
    } else {
      videoIdsIndex = 0;

      errBox.style.display = 'block';
      setTimeout(() => {
        errBox.style.display = 'none';
      }, 2000);
    }

    document.getElementById('videoTitle').innerHTML = videoData[videoIdsIndex].title;
    goDetail(videoData[videoIdsIndex].videoId);
  });
});
