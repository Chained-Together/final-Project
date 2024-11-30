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
let videoBlob; // 비디오 Blob을 대기 상태로 저장

// 카메라와 마이크 데이터를 가져와 미디어 캡처
async function startMediaRecording() {
  try {
    const constraints = {
      video: { width: 1280, height: 720 },
      audio: true,
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    // 비디오 미리보기
    videoPreview.srcObject = stream;

    // MediaRecorder 설정
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

    // 데이터가 준비되면 recordedChunks에 추가
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    // 녹화 종료 시 업로드를 하지 않도록 설정
    mediaRecorder.onstop = () => {
      // 비디오를 Blob으로 대기 상태에 저장
      videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
      recordedChunks = []; // 청크 초기화
      console.log('녹화 종료, 영상 대기 상태로 저장');
      // 업로드 버튼 활성화
      uploadButton.disabled = false;
    };

    mediaRecorder.start();
    console.log('녹화 시작');

    startButton.disabled = true;
    stopButton.disabled = false;
  } catch (error) {
    console.error('Error accessing media devices:', error);
  }
}

// 녹화 중지
function stopMediaRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    console.log('녹화 종료');

    // 비디오 미리보기 창 초기화
    videoPreview.srcObject = null; // 미리보기 비디오 제거
    videoPreview.src = ''; // 비디오 소스 비워두기
  }
}

// 업로드 버튼 클릭 시 실행되는 함수
async function uploadVideo() {
  try {
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

    // 프리사인 URL 요청
    const response = await fetch('http://localhost:3000/s3/generate-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Pre-signed URL 요청 실패');

    const { presignedUrl, key } = await response.json();
    console.log('프리사인 URL', presignedUrl, key);

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
      thumbnailUrl: thumbnailUrlInput.value || null,
      hashtags: hashtagsInput.value ? hashtagsInput.value.split(',') : [],
      visibility: visibilityInput.value || null,
      videoCode: key,
    };

    // 메타데이터 서버에 전송
    const metadataResponse = await fetch('http://localhost:3000/video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(metadataPayload),
    });

    if (metadataResponse.redirected) {
      alert('메타데이터 전송 성공');
      window.location.href = metadataResponse.url;
    } else if (metadataResponse.ok) {
      console.log('요청 성공:', await metadataResponse.json());
      alert('영상 업로드 성공!');
    } else {
      console.error('메타데이터 요청 실패:', metadataResponse.status);
      throw new Error('메타데이터 전송 실패');
    }
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
