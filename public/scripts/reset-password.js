document.querySelector('.submit-btn').addEventListener('click', async (event) => {
  event.preventDefault(); // 기본 폼 제출 방지

  const urlParams = new URLSearchParams(window.location.search); // URL에서 쿼리 매개변수 추출
  const token = urlParams.get('token'); // token 값 추출
  const password = document.getElementById('password').value; // 입력된 비밀번호

  console.log(token);
  console.log(password);

  if (!token || !password) {
    alert('유효하지 않은 토큰이거나 비밀번호를 입력하지 않았습니다.');
    return;
  }

  try {
    const response = await fetch('/password/update?token=' + encodeURIComponent(token), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newPassword: password }),
    });

    console.log(response);

    if (response.ok) {
      // 비밀번호 변경 성공 시 모달 표시
      const modal = document.getElementById('modal');
      modal.classList.remove('hidden');
    } else {
      alert('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
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
  window.location.href = '/login';
});
