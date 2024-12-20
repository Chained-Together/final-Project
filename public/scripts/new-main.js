let globalVideoData = null;
let lastVideoId = null;

//lastId의 이후 6개의 비디오를 로드함함
async function fetchVideos(lastId) {
  const url = lastId ? `video/many/${lastId}/6` : 'video/many/0/50';
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

//비디오 id를 인자로 넣의면 해당 id의 비디오를 플레이 해줌
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

//-----------------------------로직---------------------------------
//-----------------------------로직---------------------------------

let videoIds = [];
let videoIdsIndex = 0;

//1. 초기 로드에 비디오를 가져와서 재생한다
document.addEventListener('DOMContentLoaded', async () => {
  videoIdsIndex = 0;
  //1-1:초기로드 비디오 가져오기
  const videoData = await fetchVideos();
  console.log('videoData',videoData);


  //1-2:비디오ID들만 videoIds에 추출하기
  for (let i = 0; i < videoData.length; i++) {
    videoIds.push(videoData[i].id);
  }

  videoIds.reverse();
  videoData.reverse();

  // console.log('2:비디오ID들만 추출하기기', videoIds);
  
  //1-3:가저온 첫번째 비디오를 재생한다
  document.getElementById('videoTitle').innerHTML = videoData[videoIdsIndex].title
  playVideo(videoIds[videoIdsIndex]);
  goDetail(videoIds[videoIdsIndex]);

  //2. 다음 버튼을 누르면 videoIds의 다음 index번호를 다음 영상이 재생된다
const nextButton = document.getElementById('nextButton');
nextButton.addEventListener('click', async () => {
  //2-1:버튼을 누를때마다 인덱스 번호 추가
  videoIdsIndex++;
  // console.log('다음버튼을 누를때마다 인덱스 번호 추가',videoIdsIndex);

  //2-2:인덱스 번호로 다음 id찾아서 재생생
  if (videoIds && videoIds[videoIdsIndex] !== undefined) {
    playVideo(videoIds[videoIdsIndex]);
  } else {
    if( videoIdsIndex == videoIds.length-1 ) {
      videoIdsIndex = videoIds.length-1
    }
    errBox.style.display = 'block';
    setTimeout(() => {
      errBox.style.display = 'none';
    }, 1500);
    console.log('더 이상 재생할 영상이 없습니다.');
    return; // 함수 실행 중단
  }

  // 범위 내에 있을 때만 인덱스 증가
  document.getElementById('videoTitle').innerHTML = videoData[videoIdsIndex].title
  playVideo(videoIds[videoIdsIndex]);
  goDetail(videoIds[videoIdsIndex]);
});

//3. 이전 버튼을 누르면 videoIds의 다음 index번호를 이전전 영상이 재생된다
const errBox = document.querySelector('.err-box');
const prevButton = document.getElementById('prevButton');
prevButton.addEventListener('click', async () => {
  //2-1:버튼을 누를때마다 인덱스 번호 추가
  videoIdsIndex--;
  
  // console.log('다음버튼을 누를때마다 인덱스 번호 추가',videoIdsIndex);

  //2-2:인덱스 번호로 다음 id찾아서 재생
  if (videoIds && videoIds[videoIdsIndex] !== undefined) {
    playVideo(videoIds[videoIdsIndex]);
  } else {
    videoIdsIndex = 0;
    errBox.style.display = 'block';
    setTimeout(() => {
      errBox.style.display = 'none';
    }, 1500);
    console.log('더 이상 재생할 영상이 없습니다.');
  }

  document.getElementById('videoTitle').innerHTML = videoData[videoIdsIndex].title
  goDetail(videoIds[videoIdsIndex]);
});

});

