document.getElementById('toggleButton').addEventListener('click', function () {
  const header = document.getElementById('toggleHeader');
  header.style.display =
    header.style.display === 'none' || header.style.display === '' ? 'block' : 'none';
});

const token = localStorage.getItem('token');

const logoutBtn = document.getElementById('logoutBtn');
const logoutText = document.getElementById('logoutText');
if (!token) {
  document.getElementById('myChannelLink').style.display = 'none';
  document.getElementById('notificationBtn').style.display = 'none';
  document.getElementById('livestreaming').style.display = 'none';
  if (logoutText) logoutText.textContent = '로그인';

  logoutBtn.addEventListener('click', () => {
    window.location.href = '/login';
  });
}

const loginButton = document.getElementById('loginButton');
const loginLink = document.getElementById('loginLink');
const buttonText = document.getElementById('buttonText');

if (token) {
  logoutBtn.addEventListener('click', () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    localStorage.removeItem('token');
    localStorage.removeItem('pastNotifications');
    alert('로그아웃 되었습니다.');
    window.location.href = '/';
  });
}

// 기존 코드 유지...

// Live 버튼 클릭 이벤트 추가
const liveBtn = document.getElementById('liveBtn');
if (liveBtn) {
  liveBtn.addEventListener('click', () => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = 'http://www.loopfiy.com/liveStream';
    } else {
      alert('로그인이 필요한 서비스입니다.');
      window.location.href = '/login';
    }

  });
}


const setImageSrc = (src) => {
  document.querySelectorAll('#profileImage').forEach((img) => (img.src = src));
};

if (!localStorage.getItem('token')) {
  localStorage.setItem('token', urlParams.get('token'));
  console.log('URL에서 토큰을 로컬 스토리지에 저장 완료:', urlParams.get('token'));
}

const DEFAULT_PROFILE_IMAGE = '/public/images/user-50.png';

if (!token) {
  setImageSrc(DEFAULT_PROFILE_IMAGE);
} else {
  (async () => {
    try {
      const response = await fetch('/channel', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('프로필 정보를 가져오지 못했습니다.');
      }

      const profileData = await response.json();
      console.log(profileData);
      setImageSrc(profileData.profileImage || DEFAULT_PROFILE_IMAGE);
    } catch (error) {
      console.error('오류:', error);
      setImageSrc(DEFAULT_PROFILE_IMAGE);
    }
  })();
}

let storedNotifications = JSON.parse(localStorage.getItem('pastNotifications')) || [];

const eventSource = new EventSource(`/notifications/stream?token=${token}`);

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('받은 알림 :', data.message);

  storedNotifications.unshift(data.message);
  localStorage.setItem('pastNotifications', JSON.stringify(storedNotifications));

  displayNotification(data.message);
};

eventSource.onopen = () => {
  console.log('sse 연결완료');
};

eventSource.onclose = () => {
  console.log('sse 연결종료');
};

eventSource.onerror = (error) => {
  console.error('SSE Error:', error);
};

function displayNotification(notification) {
  const notificationList = document.getElementById('notificationList');
  const item = document.createElement('div');
  item.className = 'notification-item';
  item.textContent = notification.message;
  item.dataset.id = notification.id;

  notificationList.appendChild(item);
}

document.addEventListener('DOMContentLoaded', () => {
  storedNotifications.forEach((notification) => displayNotification(notification));
});

function openNotificationPopup() {
  const popup = document.getElementById('notificationPopup');
  popup.style.display = 'block';

  const notificationList = document.getElementById('notificationList');
  notificationList.innerHTML = '';

  const combinedNotifications = [...storedNotifications];

  combinedNotifications
    .sort((a, b) => b.id - a.id)
    .forEach((notification) => {
      const item = document.createElement('div');
      item.className = 'notification-item';
      item.textContent = notification.message;
      item.dataset.id = notification.id;
      item.style.backgroundColor = 'rgba(249, 249, 249, 0.5)';
      item.style.border = '1px solid #ccc';
      item.style.borderRadius = '8px';
      item.style.padding = '10px';
      item.style.margin = '8px auto';
      item.style.fontSize = '15px';
      item.style.color = '#333';
      item.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      item.style.cursor = 'pointer';
      item.style.transition = 'background-color 0.3s ease';
      item.style.width = '95%';

      // 호버 효과 추가
      item.addEventListener('mouseover', () => {
        item.style.transition = 'background-color 0.3s ease, transform 0.3s ease'; // 색상과 크기 애니메이션
        item.style.backgroundColor = '#e9e9e9'; // 색상 변경
        item.style.transform = 'scale(1.05)'; // 요소 크기 확대
      });
      item.addEventListener('mouseout', () => {
        item.style.backgroundColor = '#f9f9f9';
        item.style.transform = 'scale(1)';
      });

      item.addEventListener('click', () => handleNotificationSwipe(item));

      notificationList.appendChild(item);
    });

  storedNotifications = combinedNotifications;
}

async function handleNotificationSwipe(item) {
  const id = parseInt(item.dataset.id, 10);

  const response = await fetch(`/notifications/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    ('삭제 실패!');
  }

  storedNotifications = storedNotifications.filter((notification) => notification.id !== id);
  localStorage.setItem('pastNotifications', JSON.stringify(storedNotifications));

  item.remove();

  console.log(`알림 ${id} 제거 완료`);
}

document.getElementById('notificationBtn').addEventListener('click', () => {
  openNotificationPopup();
});

document.getElementById('closePopupBtn').addEventListener('click', () => {
  const popup = document.getElementById('notificationPopup');
  popup.style.display = 'none'; // 팝업창 숨기기
});

document.getElementById('home').addEventListener('click', () => {
  window.location.href = '/';
});

document.getElementById('myChannelLink').addEventListener('click', () => {
  window.location.href = '/myChannel';
});
