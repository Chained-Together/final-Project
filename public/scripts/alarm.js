const token = localStorage.getItem('token');
const eventSource = new EventSource(`http://localhost:3000/notifications/stream?token=${token}`);

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('받은 알림 :', data);
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
