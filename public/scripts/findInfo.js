// 버튼 클릭 이벤트 핸들러
document.querySelector('.submit-btn').addEventListener('click', async (event) => {
  event.preventDefault(); // 폼 제출 기본 동작 방지

  const email = document.getElementById('email').value;

  if (!email) {
    alert('이메일 주소를 입력해주세요.');
    return;
  }

  try {
    const response = await fetch('/password/reset-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      // 이메일 전송 성공 시 모달 창 표시
      const modal = document.getElementById('modal');
      modal.classList.remove('hidden'); // 모달 표시
    } else {
      alert('메일 전송에 실패했습니다. 다시 시도해주세요.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
});

// 초기 모달 창 숨김 설정
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event triggered'); // 이벤트 실행 여부 확인
  const modal = document.getElementById('modal');
  if (modal) {
    console.log('Modal element found:', modal); // Modal 요소가 올바르게 선택되었는지 확인
    modal.classList.add('hidden'); // 숨김 클래스 추가
  } else {
    console.error('Modal element not found'); // Modal 요소가 없을 때
  }
});

// 모달의 "메인페이지로 돌아가기" 버튼 동작
document.getElementById('go-to-main-btn').addEventListener('click', () => {
  window.location.href = '/main'; // 메인 페이지로 이동
});
