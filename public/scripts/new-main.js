let globalVideoData = null;
let lastVideoId = null;
let videoIds = [];

//1. 초기 로드에 비디오를 가져와서 재생한다다
document.addEventListener('DOMContentLoaded', async () => {
  console.log('1:초기로드 비디오 가져오기', await fetchVideos());
  //1:초기로드 비디오 가져오기
  fetchVideos();

  let videoData = fetchVideos();
  for (let i = 0; i < videoData.length; i++) {
    videoIds.push(videoData[i].id);
  }
  console.log('2:비디오ID들만 추출하기기', videoIds);

  // console.log('3:추춣한 비디오id를 videoArr에 푸쉬하기',videoArr);
});

//lastId의 이후 6개의 비디오를 로드함함
async function fetchVideos(lastId) {
  const url = lastId ? `video/many/${lastId}/6` : 'video/many/1/6';
  const response = await fetch(url, { method: 'GET' });

  if (!response.ok) {
    throw new Error('데이터를 가져오지 못했습니다.');
  }

  return response.json();
}

async function 비디오더가져오기(lastVideoId) {
  try {
    const newVideos = await fetchVideos(lastVideoId);
    if (newVideos.length > 0) {
      // 마지막 비디오 ID 업데이트
      lastVideoId = newVideos[newVideos.length - 1].id;
    } else {
      console.log('더 이상 불러올 데이터가 없습니다.');
      // $(window).off('scroll'); // 더 이상 이벤트 감지 중단
    }
  } catch (error) {
    console.error('추가 데이터를 가져오는 중 오류 발생:', error);
  } finally {
    isFetching = false;
  }
}

//비디오 id를 인자로 넣의면 해당 id의 비디오를 플레이 해줌줌
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
  console.log('videoData', videoData);

  globalVideoData = videoData;

  // HLS.js를 사용해 비디오 재생
  const hlsUrl = videoData?.videoUrl;
  console.log('HLS URL:', hlsUrl);
  if (!hlsUrl) {
    throw new Error('비디오 URL이 없습니다.');
  }

  if (Hls.isSupported()) {
    // HLS.js 사용
    const hls = new Hls();
    hls.loadSource(hlsUrl);
    hls.attachMedia(video); // 기존 video 요소에 연결
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      console.log('HLS manifest loaded. Starting playback...');
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
      console.log('Native HLS support detected. Starting playback...');
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

playVideo(20);

$('#nextButton').on('click', async () => {
  index++;
  if (videoArr[a][index] === videoArr[a].length - 1) {
    videoArr.push(await fetchVideos(lastVideoId));
    index = 0;
    a++;
  }
});
