document.addEventListener('DOMContentLoaded', async () => {
    const linkBtn = document.getElementById('linkBtn');
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');
  
    try {

      const response = await fetch(`/video/link/${videoId}`);
      if (!response.ok) {
        throw new Error('비디오 정보를 가져올 수 없습니다.');
      }
  
      const videoData = await response.json();
  
      
      if (videoData.visibility === 'PRIVATE') {
        linkBtn.style.display = 'none';
      }
      linkBtn.addEventListener('click', async () => {
        try {
          if (!videoData.url) {
            throw new Error('URL이 반환되지 않았습니다.');
          }
  
          await navigator.clipboard.writeText(videoData.url);
          alert('링크가 클립보드에 복사되었습니다.');
        } catch (error) {
          console.error('오류:', error);
          alert('URL 복사 실패.');
        }
      });
    } catch (error) {
      console.error('오류:', error);
      alert('비디오 정보를 가져오는 데 실패했습니다.');
    }
  });
  