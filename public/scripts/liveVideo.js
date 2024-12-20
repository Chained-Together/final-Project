const startButton = document.getElementById('startRecording');
const stopButton = document.getElementById('stopRecording');
const uploadButton = document.getElementById('uploadBtn'); // 업로드 버튼 추가
const videoPreview = document.getElementById('preview');

const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('video-description');
const hashtagsInput = document.getElementById('hashtags');
const visibilityInput = document.getElementById('visibility');
const thumbnailUrlInput = document.getElementById('thumbnailUrl');
const token = localStorage.getItem('token');

let mediaRecorder;
let recordedChunks = [];
let videoBlob;

async function getVideoDuration(blob) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      console.log('Video duration:', video.duration);
      resolve(video.duration);
    };

    video.onerror = (error) => {
      reject('영상 길이를 계산하지 못했습니다.');
    };

    video.src = URL.createObjectURL(blob);
  });
}

async function startMediaRecording() {
  try {
    const constraints = {
      video: { width: 1280, height: 720 },
      audio: true,
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    videoPreview.srcObject = stream;

    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/mp4' });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      videoBlob = new Blob(recordedChunks, { type: 'video/mp4' });
      recordedChunks = []; // 청크 초기화

      const videoDuration = await getVideoDuration(videoBlob);
      console.log('영상 길이 (초):', videoDuration);

      uploadButton.disabled = false;
    };

    mediaRecorder.start();

    startButton.disabled = true;
    stopButton.disabled = false;
  } catch (error) {
    console.error('Error accessing media devices:', error);
  }
}

function stopMediaRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    console.log('녹화 종료');

    videoPreview.srcObject = null;
    videoPreview.src = '';
  }
}

async function uploadVideo() {
  try {
    if (!videoBlob) {
      alert('업로드할 영상이 없습니다.');
      return;
    }

    // 비디오 길이 추출
    const videoDuration = await getVideoDuration(videoBlob);

    const payload = {
      fileType: videoBlob.type,
      fileSize: videoBlob.size,
      bucket: '15-final-project',
      region: 'ap-northeast-2',
      videoDuration: videoDuration,
    };
    // 프리사인 URL 요청
    const response = await fetch('/s3/generate-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Pre-signed URL 요청 실패');

    const { presignedUrl, key } = await response.json();

    // 프리사인 URL로 비디오 업로드
    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      body: videoBlob,
      headers: {
        'Content-Type': videoBlob.type,
      },
    });

    if (!uploadResponse.ok) throw new Error('파일 업로드 실패');

    alert('파일 업로드 성공!');

    // 메타데이터 페이로드 준비
    const metadataPayload = {
      title: titleInput.value || null,
      description: descriptionInput.value || null,
      hashtags: hashtagsInput.value ? hashtagsInput.value.split(',') : [],
      visibility: visibilityInput.value || null,
      videoCode: key,
    };

    // 메타데이터 서버에 전송
    const metadataResponse = await fetch('/video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(metadataPayload),
    });

    if (metadataResponse.redirected) {
      alert('메타데이터 전송 성공');
      // window.location.href = metadataResponse.url;
    } else if (metadataResponse.ok) {
      console.log('요청 성공:', await metadataResponse.json());
      alert('영상 업로드 성공!');
    } else {
      console.error('메타데이터 요청 실패:', metadataResponse.status);
      throw new Error('메타데이터 전송 실패');
    }
    window.location.href = '/myChannel';
  } catch (error) {
    alert(`업로드 중 오류 발생: ${error.message}`);
  } finally {
    startButton.disabled = false;
    stopButton.disabled = true;
    uploadButton.disabled = true; // 업로드 버튼 비활성화
  }
}

// 버튼 클릭 이벤트
startButton.addEventListener('click', startMediaRecording);
stopButton.addEventListener('click', stopMediaRecording);
uploadButton.addEventListener('click', uploadVideo);

// 초기에는 업로드 버튼 비활성화
uploadButton.disabled = true;
