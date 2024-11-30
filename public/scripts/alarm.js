let storedNotifications = JSON.parse(localStorage.getItem('pastNotifications')) || [];

const token = localStorage.getItem('token');
const eventSource = new EventSource(`http://localhost:3000/notifications/stream?token=${token}`);

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
