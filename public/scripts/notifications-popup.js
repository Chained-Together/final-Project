export function openNotificationPopup() {
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
      item.addEventListener('click', () => handleNotificationSwipe(item));
      notificationList.appendChild(item);
    });

  storedNotifications = combinedNotifications;
}

export function closeNotificationPopup() {
  const popup = document.getElementById('notificationPopup');
  popup.style.display = 'none';
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
