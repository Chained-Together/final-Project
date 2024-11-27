// 폼 제출 이벤트 핸들러
document.getElementById('reset-password-form').addEventListener('submit', async (event) => {
  event.preventDefault(); // 기본 폼 제출 방지

  const urlParams = new URLSearchParams(window.location.search); // URL에서 쿼리 매개변수 추출
  const token = urlParams.get('token'); // token 값 추출
  const password = document.getElementById('password').value; // 입력된 비밀번호

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
      body: JSON.stringify({ password }),
    });

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

// 모달의 "메인페이지로 돌아가기" 버튼 동작
document.getElementById('go-to-main-btn').addEventListener('click', () => {
  window.location.href = '/main'; // 메인 페이지로 이동
});

//
