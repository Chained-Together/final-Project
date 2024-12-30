document.getElementById('closeModal').addEventListener('click', (event) => {
  event.stopPropagation(); // 이벤트 전파 방지 (버튼 외부 클릭을 방지)

  const modal = document.getElementById('streamKeyModal');
  console.log('Close button clicked');
  modal.style.display = 'none'; // 모달을 숨깁니다.
});

// 모달 외부 클릭 시 모달 숨김
window.addEventListener('click', (event) => {
  const modal = document.getElementById('streamKeyModal');

  // 모달 영역 외부를 클릭한 경우 모달을 숨깁니다.
  if (event.target === modal) {
    modal.style.display = 'none'; // 모달을 숨깁니다.
  }
});

// 모달 열기 버튼 클릭 시 모달 표시
document.getElementById('livestreaming').addEventListener('click', async () => {
  const modal = document.getElementById('streamKeyModal');
  modal.style.display = 'block'; // 모달을 표시합니다.

  try {
    console.log('Fetching stream key...');
    const response = await fetch('obs/streamKey', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response Data:', data);

    const streamKey = data.streamKey;

    console.log(streamKey);
    const streamingUrl = data.streamingUrl;

    document.getElementById('streamKeyText').textContent = `스트림 키: ${streamKey}`;
    document.getElementById('streamingUrlText').textContent =
      `스트리밍 URL: rtmp://ec2-3-35-238-65.ap-northeast-2.compute.amazonaws.com:1935/live`;
  } catch (error) {
    console.error('Error fetching stream key:', error);
    document.getElementById('streamKeyText').textContent = '스트림 키를 가져오는 데 실패했습니다.';
  }
});

// 방송 시작 버튼 클릭 시
document.getElementById('optionBtn').addEventListener('click', async () => {
  const title = document.getElementById('liveTitle').value;

  if (!title) {
    alert('방송 제목을 입력하세요.');
    return;
  }

  try {
    const response = await fetch('/liveStreaming', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Live streaming created:', data);
    alert('방송이 설정이 완료 되었습니다!');
    document.getElementById('streamKeyModal').style.display = 'none'; // 방송 시작 후 모달 숨김
  } catch (error) {
    console.error('Error starting live streaming:', error);
    alert('방송이 설정을 실패했습니다.');
  }
});
