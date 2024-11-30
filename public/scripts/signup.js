document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const sendVerificationCodeBtn = document.getElementById('sendVerificationCodeBtn');

  function validateField(input, regex, errorMessage) {
    const value = input.value.trim();
    const errorElement = input.nextElementSibling;
    if (!regex.test(value)) {
      errorElement.textContent = errorMessage;
      input.classList.add('error');
      return false;
    }
    errorElement.textContent = '';
    input.classList.remove('error');
    return true;
  }

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmedPasswordInput = document.getElementById('confirmedPassword');
  const codeInput = document.getElementById('code');
  const phoneNumberInput = document.getElementById('phoneNumber');

  sendVerificationCodeBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();

    if (!validateField(emailInput, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, '유효한 이메일을 입력하세요.')) {
      return;
    }
    try {
      const response = await fetch('/nodemailer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        alert('인증번호가 이메일로 전송되었습니다.');
      } else {
        alert('인증번호 전송에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('서버 오류가 발생했습니다.');
    }
  });

  passwordInput.addEventListener('blur', () => {
    validateField(
      passwordInput,
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      '비밀번호는 최소 8자이며, 문자와 숫자를 포함해야 합니다.',
    );
  });

  confirmedPasswordInput.addEventListener('blur', () => {
    const errorElement = confirmedPasswordInput.nextElementSibling;
    if (confirmedPasswordInput.value !== passwordInput.value) {
      errorElement.textContent = '비밀번호가 일치하지 않습니다.';
      confirmedPasswordInput.classList.add('error');
    } else {
      errorElement.textContent = '';
      confirmedPasswordInput.classList.remove('error');
    }
  });

  codeInput.addEventListener('blur', () => {
    validateField(codeInput, /^[a-f0-9]{6}/, '인증번호를 입력해주세요.');
  });
  phoneNumberInput.addEventListener('blur', () => {
    validateField(phoneNumberInput, /^\d{10,11}$/, '전화번호는 10-11자리 숫자여야 합니다.');
  });

  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const isEmailValid = validateField(
      emailInput,
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      '유효한 이메일을 입력하세요.',
    );
    const isPasswordValid = validateField(
      passwordInput,
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      '비밀번호는 최소 8자이며, 문자와 숫자를 포함해야 합니다.',
    );
    const isConfirmedPasswordValid =
      confirmedPasswordInput.value.trim() === passwordInput.value.trim();
    const isCodeValid = validateField(codeInput, /^[a-f0-9]{6}/, '인증번호를 입력해주세요.');
    const isPhoneNumberValid = validateField(
      phoneNumberInput,
      /^\d{10,11}$/,
      '전화번호는 10-11자리 숫자여야 합니다.',
    );

    if (
      !isEmailValid ||
      !isPasswordValid ||
      !isConfirmedPasswordValid ||
      !isCodeValid ||
      !isPhoneNumberValid
    ) {
      alert('모든 값을 올바르게 입력하세요.');
      return;
    }

    try {
      const response = await fetch('/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailInput.value.trim(),
          password: passwordInput.value.trim(),
          confirmedPassword: confirmedPasswordInput.value.trim(),
          name: document.getElementById('name').value.trim(),
          nickname: document.getElementById('nickname').value.trim(),
          code: codeInput.value.trim(),
          phoneNumber: phoneNumberInput.value.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || '회원가입에 실패했습니다.';
        alert(`오류: ${errorMessage}`);
        return;
      }

      alert('회원가입이 성공적으로 완료되었습니다!');
      window.location.href = '/login';
    } catch (err) {
      alert('서버와 통신 중 오류가 발생했습니다.');
    }
  });
});
