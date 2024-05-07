function validateEmail(email) {
  const emailRegex = /^[a-z0-9]+@[a-z]+.[a-z]{2,3}$/i;
  return emailRegex.test(email);
}

const loginForm = document.querySelector('.loginBox');
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const emailInput = document.querySelector('.input[type="email"]');
  const passwordInput = document.querySelector('.input[type="password"]');

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!validateEmail(email)) {
    alert('유효한 이메일 주소를 입력해주세요.');
    return;
  }

  const formData = {
    email,
    password,
  };

  if (!email || !password) {
    return alert('모든 값을 입력해 주세요.');
  }

  try {
    const res = await fetch('/user/role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    
    if (res.ok) {
      localStorage.setItem('token', data.data);

      alert('관리자 모드로 로그인 되었습니다.');
      window.location.href = '/admin_product';

    } else {
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
    }

  } catch (err) {
    console.error(err);
  }
});