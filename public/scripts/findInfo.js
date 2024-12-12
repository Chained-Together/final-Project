document.querySelector('.submit-btn').addEventListener('click', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;

  if (!email) {
    alert('이메일 주소를 입력해주세요.');
    return;
  }

  try {
    const response = await fetch('/password/reset-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      const modal = document.getElementById('modal');
      modal.classList.remove('hidden');
    } else {
      alert('메일 전송에 실패했습니다. 다시 시도해주세요.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event triggered');
  const modal = document.getElementById('modal');
  if (modal) {
    console.log('Modal element found:', modal);
    modal.classList.add('hidden');
  } else {
    console.error('Modal element not found');
  }
});

document.getElementById('go-to-main-btn').addEventListener('click', () => {
  window.location.href = '/';
});
