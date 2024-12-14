document.getElementById('livestreaming').addEventListener('click', async () => {
    // 모달 열기
    const modal = document.getElementById('streamKeyModal');
    modal.style.display = 'block';
  
    // 스트림 키 가져오기
    try {
      const response = await fetch('/obs/streamKey', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,  // JWT 토큰을 Authorization 헤더에 넣어 보내기
        },
      });
  
      if (!response.ok) {
        throw new Error('스트림 키를 가져오는 데 실패했습니다.');
      }
  
      const data = await response.json();
      const streamKey = data.streamKey; // 서버에서 받은 스트림 키
      const streamingUrl = data.streamingUrl; // 서버에서 받은 스트리밍 URL
  
      // 스트림 키와 URL을 모달에 표시
      document.getElementById('streamKeyText').textContent = `스트림 키: ${streamKey}`;
      document.getElementById('streamingUrlText').textContent = `스트리밍 URL: ${streamingUrl}`;
  
    } catch (error) {
      console.error(error);
      document.getElementById('streamKeyText').textContent = '스트림 키를 가져오는 데 실패했습니다.';
    }
  });
  
  // 모달 닫기 버튼 처리
  document.getElementById('closeModal').addEventListener('click', () => {
    const modal = document.getElementById('streamKeyModal');
    modal.style.display = 'none';  // 모달 닫기
  });
  
  // 모달 외부 클릭 시 닫기 처리
  window.addEventListener('click', (event) => {
    const modal = document.getElementById('streamKeyModal');
    if (event.target === modal) {
      modal.style.display = 'none';  // 모달 닫기
    }
  });
  