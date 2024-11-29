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

    window.location.href = '/main';
  } catch (error) {
    console.error(error);
    alert(`로그인 중 오류 발생: ${error.message}`);
  }
});
document.getElementById('google-connect').addEventListener('click', (event) => {
  event.preventDefault();
  window.location.href = '/auth/google';
});
document.getElementById('Naver-connect').addEventListener('click', (event) => {
  event.preventDefault();
  window.location.href = '/auth/naver';
});
