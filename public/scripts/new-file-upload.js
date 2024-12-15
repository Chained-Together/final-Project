const upload = document.getElementById('uploadbtn');
const fileInput = document.getElementById('file');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const hashtagsInput = document.getElementById('hashtags');
const visibilityInput = document.getElementById('visibility');
const uploadToken = localStorage.getItem('token');

window.addEventListener('load', () => {
  const savedVisibility = localStorage.getItem('visibility');
  if (savedVisibility) {
    visibilityInput.value = savedVisibility;
  }
});

visibilityInput.addEventListener('input', () => {
  localStorage.setItem('visibility', visibilityInput.value);
});

upload.addEventListener('click', async () => {
  console.log(1);
  
  const file = fileInput.files[0];
  if (!file) {
    alert('파일을 선택해주세요.');
    return;
  }

  try {
    const payload = {
      fileType: file.type,
      fileSize: file.size,
      bucket: '15-final-project',
      region: 'ap-northeast-2',
    };

    const response = await fetch('/s3/generate-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${uploadToken}` },
      body: JSON.stringify(payload),
    });
    console.log(response)

    if (!response.ok) throw new Error('Pre-signed URL 요청 실패');

    const { presignedUrl, key } = await response.json();
    console.log('프리사인 URL', presignedUrl, key);

    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (uploadResponse.ok) {
      alert('파일 업로드 성공!');
    }

    const metadataPayload = {
      title: titleInput.value || null,
      description: descriptionInput.value || null,
      hashtags: hashtagsInput.value ? hashtagsInput.value.split(',') : [],
      visibility: visibilityInput.value || null,
      videoCode: key,
    };
    console.log('metadataPayload', metadataPayload);

    const metadataResponse = await fetch('/video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${uploadToken}`,
      },
      redirect: 'follow',
      body: JSON.stringify(metadataPayload),
    });
    console.log(`메타데이터: ${metadataResponse}`);

    if (metadataResponse.redirected) {
      alert('메타데이터 전송 성공');
      window.location.href = metadataResponse.url;
    } else if (metadataResponse.ok) {
      console.log('요청 성공:', await metadataResponse.json());
      alert('영상 업로드 성공!');
    } else {
      console.error('요청 실패:', metadataResponse.status);
      throw new Error('메타데이터 전송 실패');
    }
  } catch (error) {
    alert(`업로드 중 오류 발생: ${error.message}`);
  }
});

document.getElementById("file").addEventListener("change", function (event) {
  const fileInput = event.target;
  const fileNameDisplay = document.getElementById("fileNameDisplay");

  if (fileInput.files.length > 0) {
    const fileName = fileInput.files[0].name; // 업로드된 파일명 가져오기
    fileNameDisplay.textContent = fileName; // 파일명을 <p>에 표시
  } else {
    fileNameDisplay.textContent = "영상파일을 첨부 하세요"; // 파일이 없을 경우 기본 메시지 표시
  }
});