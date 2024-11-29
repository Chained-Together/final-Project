const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const url = '/auth/login';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    if (!response.ok) {
      throw new Error('로그인에 실패했습니다.');
    }

    const token = await response.headers.get('Authorization');

    console.log('난 로그인 토큰이야', token);

    if (token) {
      localStorage.setItem('token', token);
    } else {
      console.error('토큰이 존재하지 않습니다.');
    }

    const notificationResponse = await fetch('/notifications', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!notificationResponse.ok) {
      throw new Error('알림 정보를 로드하는데 실패했습니다.');
    }

    const notifications = await notificationResponse.json();
    
    localStorage.setItem('pastNotifications', JSON.stringify(notifications));

    window.location.href = '/main';
  } catch (error) {
    console.error(error);
    alert(`로그인 중 오류 발생: ${error.message}`);
  }
});
document.getElementById('google-connect').addEventListener('click', (event) => {
  event.preventDefault();
  // 구글 소셜 로그인 엔드포인트로 리다이렉트
  window.location.href = '/auth/google';
});

document.getElementById('Naver-connect').addEventListener('click', (event) => {
  event.preventDefault();
  // 네이버 소셜 로그인 엔드포인트로 리다이렉트
  window.location.href = '/auth/naver';
});

// 소셜 로그인 후 콜백에서 토큰 처리 (예시)
if (
  window.location.pathname.includes('/google/callback') ||
  window.location.pathname.includes('/naver/callback')
) {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  console.log('IMMMMMMMMMTOKEN', token);
  if (token) {
    localStorage.setItem('token', token); // JWT 토큰을 저장

    window.location.href = '/main'; // 메인 페이지로 리다이렉트
  } else {
    console.error('토큰이 전달되지 않았습니다.');
  }
}
