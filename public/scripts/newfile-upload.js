document.addEventListener('DOMContentLoaded', () => {
  const uploadBtn = document.getElementById('uploadbtn');
  const fileInput = document.getElementById('file');
  const titleInput = document.getElementById('title');
  const descriptionInput = document.getElementById('description');
  const hashtagsInput = document.getElementById('hashtags');
  const visibilityInput = document.getElementById('visibility');
  const fileNameDisplay = document.getElementById('fileNameDisplay');
  const token = localStorage.getItem('token');


  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    fileNameDisplay.textContent = file ? file.name : '영상파일을 첨부 하세요';
  });


  window.addEventListener('load', () => {
    const savedVisibility = localStorage.getItem('visibility');
    if (savedVisibility) {
      visibilityInput.value = savedVisibility;
    }
  });

  visibilityInput.addEventListener('input', () => {
    localStorage.setItem('visibility', visibilityInput.value);
  });


  uploadBtn.addEventListener('click', async (event) => {
    event.preventDefault();

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
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Pre-signed URL 요청 실패');
      const { presignedUrl, key } = await response.json();


      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!uploadResponse.ok) throw new Error('파일 업로드 실패');
      alert('파일 업로드 성공!');


      const metadataPayload = {
        title: titleInput.value || null,
        description: descriptionInput.value || null,
        hashtags: hashtagsInput.value ? hashtagsInput.value.split(',') : [],
        visibility: visibilityInput.value || null,
        videoCode: key,
      };

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
        window.location.href = metadataResponse.url;
      } else if (metadataResponse.ok) {
        alert('영상 업로드 성공!');
      } else {
        throw new Error('메타데이터 전송 실패');
      }
    } catch (error) {
      console.error('오류:', error);
      alert(`업로드 중 오류 발생: ${error.message}`);
    }
  });
});
