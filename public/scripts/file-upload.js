const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('video-description');
const hashtagsInput = document.getElementById('hashtags');
const visibilityInput = document.getElementById('visibility');
const thumbnailUrlInput = document.getElementById('thumbnailUrl');
const token = localStorage.getItem('token');

// 페이지가 로드될 때 저장된 값을 복원
window.addEventListener('load', () => {
  const savedVisibility = localStorage.getItem('visibility');
  if (savedVisibility) {
    visibilityInput.value = savedVisibility;
  }
});

// 입력값이 변경될 때 localStorage에 저장
visibilityInput.addEventListener('input', () => {
  localStorage.setItem('visibility', visibilityInput.value);
});

uploadBtn.addEventListener('click', async () => {
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

    const response = await fetch('http://localhost:3000/s3/generate-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Pre-signed URL 요청 실패');

    const { presignedUrl, key } = await response.json();
    console.log('프리사인 URL', presignedUrl, key);

    const metadataPayload = {
      title: titleInput.value || null,
      description: descriptionInput.value || null,
      thumbnailUrl: thumbnailUrlInput.value || null,
      hashtags: hashtagsInput.value ? hashtagsInput.value.split(',') : [],
      visibility: visibilityInput.value || null,
      videoCode: key,
    };

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
      const metadataResponse = await fetch('http://localhost:3000/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        redirect: 'follow',
        body: JSON.stringify(metadataPayload),
      });
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


// alert(metadataResponse);



// if (metadataResponse.ok) {
  //     alert('메타데이터 전송 성공!');
  //   } else {
  //     const errorData = await metadataResponse.json();
  //     console.error('Error response from /video:', errorData);
  //     throw new Error(`메타데이터 전송 실패: ${errorData.message || 'Unknown error'}`);
  //   }
  // }