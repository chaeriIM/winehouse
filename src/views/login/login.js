document.addEventListener('DOMContentLoaded', function () {

  function validateEmail(email) {
    const emailRegex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/i;
    return emailRegex.test(email);
  }

  function handleFormSubmission(event) {
    event.preventDefault();

    const emailInput = document.querySelector('.input[type="email"]');
    const passwordInput = document.querySelector('.input[type="password"]');

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!validateEmail(email)) {
      alert('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    // API 주소
    const apiURL = "/user/login";

    // 사용자 정보를 담은 객체
    const userData = {
      email: emailInput.value.trim(),
      password: passwordInput.value
    };

    // API 호출 및 데이터 전송
    fetch(apiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Server Response:', data);
        if (data.status === 200 && data.data) {
          // 로그인 성공 및 토큰 저장
          localStorage.setItem('token', data.data);
          alert('로그인 되셨습니다.');
          window.location.href = '/';
        } else {
          // 로그인 실패
          alert('로그인에 실패했습니다. 다시 시도해주세요.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('서버와의 통신 중 오류가 발생했습니다.');
      });
  }

  const loginForm = document.querySelector('.box');
  loginForm.addEventListener('submit', handleFormSubmission);
});
