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
    if (token) {
      localStorage.setItem('token', token);
      console.log('token123',token)
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

    window.location.href = '/';
  } catch (error) {
    console.error(error);
    alert(`로그인 중 오류 발생: ${error.message}`);
  }
});

document.getElementById('google-connect').addEventListener('click', (event) => {
  event.preventDefault();
  window.location.href = '/auth/google';
});

document.getElementById('naver-connect').addEventListener('click', (event) => {
  event.preventDefault();
  window.location.href = '/auth/naver'; 
});

document.addEventListener('DOMContentLoaded', () => {
  const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
    const [key, value] = cookie.split('=');
    acc[key] = value;
    return acc;
  }, {});

  console.log('모든 쿠키:', cookies);

  const token = cookies.Authorization;
  if (token) {
    localStorage.setItem('token', token);
    console.log('로컬스토리지에 저장된 토큰:', localStorage.getItem('token'));
  } else {
    console.error('Authorization 쿠키를 찾을 수 없습니다.');
  }
});

document.getElementById('signupBtn').addEventListener('click', (event) => {
  event.preventDefault();
  window.location.href = '/signup';
});
