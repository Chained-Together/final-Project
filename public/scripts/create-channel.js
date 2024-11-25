const createChannrlForm = document.getElementById('createChannelForm');

createChannrlForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = document.getElementById('name');
  const profileImage = document.getElementById('profileImage');
  const url = '/channel';
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name.value,
        profileImage: profileImage.value,
      }),
    });

    if (!response.ok) {
      throw new Error('채널 생성에 실패했습니다.');
    }
  } catch (error) {
    console.error(error);
    alert(`채널 생성 중 오류 발생: ${error.message}`);
  }
});
