const startButton = document.getElementById('startRecording');
const stopButton = document.getElementById('stopRecording');
const uploadButton = document.getElementById('uploadBtn'); // 업로드 버튼 추가
const videoPreview = document.getElementById('preview');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('video-description');
const hashtagsInput = document.getElementById('hashtags');
const visibilityInput = document.getElementById('visibility');
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

    videoPreview.srcObject = null;
    videoPreview.src = '';
  }
}

async function uploadVideo() {
  try {
    console.log('Upload video 시작');
    if (!videoBlob) {
      alert('업로드할 영상이 없습니다.');
      return;
    }

    const payload = {
      fileType: videoBlob.type,
      fileSize: videoBlob.size,
      bucket: '15-final-project',
      region: 'ap-northeast-2',
    };

    const response = await fetch('/s3/generate-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });

    if (!response || !response.ok) {
      console.error('Pre-signed URL 요청 실패:', response);
      throw new Error('Pre-signed URL 요청 실패');
    }

    const { presignedUrl, key } = await response.json();

    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      body: videoBlob,
      headers: { 'Content-Type': videoBlob.type },
    });

    if (!uploadResponse.ok) throw new Error('파일 업로드 실패');
    const metadataPayload = {
      title: titleInput.value || null,
      description: descriptionInput.value || null,
      hashtags: hashtagsInput.value ? hashtagsInput.value.split(',') : [],
      visibility: visibilityInput.value || null,
      videoCode: key,
    };

    const metadataResponse = await fetch('/video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(metadataPayload),
    });
    if (metadataResponse.redirected) {
      alert('메타데이터 전송 성공');
    } else if (metadataResponse.ok) {
      alert('영상 업로드 성공!');
    } else {
      throw new Error('메타데이터 전송 실패');
    }
    window.location.href = '/myChannel';
  } catch (error) {
    alert(`업로드 중 오류 발생: ${error.message}`);
  } finally {
    startButton.disabled = false;
    stopButton.disabled = true;
    uploadButton.disabled = true;
  }
}

startButton.addEventListener('click', startMediaRecording);
stopButton.addEventListener('click', stopMediaRecording);
uploadButton.addEventListener('click', (event) => {
  event.preventDefault();
  uploadVideo();
});
uploadButton.disabled = true;
