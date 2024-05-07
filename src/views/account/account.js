const signUpButton = document.getElementById("editLoginButton");
signUpButton.addEventListener("click", async function (e) {
  e.preventDefault();

  const nameInput = document.querySelector('#nameInput');
  const emailInput = document.querySelector('#emailInput');
  const passwordInput = document.querySelector('#passwordInput');
  const confirmPasswordInput = document.querySelector('#confirmPasswordInput');
  const addressInput = document.querySelector('#addressInput');
  const ageInput = document.querySelector('#ageInput');
  const phoneNumberInput = document.querySelector('#phoneNumberInput');

  const passwordsMatch = passwordInput.value === confirmPasswordInput.value;
  const isValidName = /^[가-힣]+$/.test(nameInput.value);
  const isValidEmail = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/i.test(emailInput.value);
  const isValidPhoneNumber = /^01[0-9]-\d{4}-\d{4}$/.test(phoneNumberInput.value);
  const isValidAge = /^(2[0-9]|[3-9]\d|\d{3,})$/.test(ageInput.value);

  if (!passwordsMatch) {
    alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
  } else if (!isValidName) {
    alert('이름을 확인해주세요.');
  } else if (!isValidEmail) {
    alert('이메일 주소를 확인해주세요.');
  } else if (!addressInput) {
    alert('주소를 확인해주세요.');
  } else if (!isValidPhoneNumber) {
    alert('전화번호를 확인해주세요.');
  } else if (!isValidAge) {
    alert('만 18세 미만입니다.');
  } else {
    // 서버로 데이터 전송
    try {
      const response = await fetch("/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameInput.value,
          email: emailInput.value,
          password: passwordInput.value,
          address: addressInput.value,
          tel: phoneNumberInput.value,
          age: ageInput.value,
        }),
      });
      const responseData = await response.json();
      console.log(responseData);

      if (response.status === 201) {
        alert(responseData.message);
        window.location.href = "/login";
      } else {
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("서버와의 통신 중 오류가 발생했습니다.");
    }
  }
});

// 나이 입력 값 검증 함수
// function validateAge() {
//   let ageInput = document.getElementById('ageInput');
//   let ageErrorMessage = document.getElementById('ageErrorMessage');

//   // 나이 입력값 정규식 확인
//   let agePattern = /^\d+$/;

//   if (agePattern.test(ageInput.value)) {
//     // 에러 메시지 숨김
//     ageErrorMessage.style.display = 'none';
//   } else {
//     // 에러 메시지 표시
//     ageErrorMessage.style.display = 'block';
//   }
// }
// 비밀번호 확인 함수
// function validatePassword() {
//   let passwordInput = document.getElementById('passwordInput');
//   let confirmPasswordInput = document.getElementById('confirmPasswordInput');
//   let passwordMatchMessage = document.getElementById('passwordMatchMessage');

//   const passwordsMatch = passwordInput.value === confirmPasswordInput.value;

//   if (confirmPasswordInput.value && !passwordsMatch) {
//     // 불일치할 경우 에러 메시지 표시
//     passwordMatchMessage.style.display = 'block';
//   } else {
//     // 일치하거나 값이 없을 경우 에러 메시지 숨김
//     passwordMatchMessage.style.display = 'none';
//   }
// }

// // 비밀번호 입력칸에 input 이벤트 리스너 추가
// passwordInput.addEventListener('input', validatePassword);
// // 비밀번호 확인 입력칸에 input 이벤트 리스너 추가
// confirmPasswordInput.addEventListener('input', validatePassword);

// // 비밀번호 일치 여부 초기 검증
// validatePassword();
